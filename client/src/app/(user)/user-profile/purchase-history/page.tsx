"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {Spinner,Button,Pagination} from "@nextui-org/react";
import {SpinnerLoader} from '@/components/loader/loaders';
import { getCurrCustomer } from "@/app/redux/feature/user/api";
import { FaRupeeSign } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import {useRouter} from 'next/navigation';
import instance from "@/utils/axios";
import {formatDateTime} from '@/utils/DateFormat';
import { AiFillProduct } from "react-icons/ai";
import { FaCoins } from "react-icons/fa";
import UserDropdown from "@/components/userDropdown";
import { FaChevronRight,FaChevronDown } from "react-icons/fa";

interface Order {
  _id: string;
  totalAmount: number;
  razorpayOrderId: string;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  method: string;
  productIds: string[];
}

const ProductList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrder, setTotalOrder] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDataPerPage, setShowDataPerPage] = useState<boolean>(false);
  const router=useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.user?.user);
  console.log("user", user);

  const fetchOrder = async (_id: string) => {
    setLoading(true);
    try {
      const response = await instance.get(`/order/customer/${_id}`,{
         params:{
           searchTerm,
          currentPage,
          dataPerPage,
         }
      });
      setOrders(response.data.orders);  
      setTotalPages(response.data.totalPages);
      setTotalOrder(response.data.totalOrders);
      console.log("data", response);
    } catch (error) {
      console.error("Error fetching order by user ID:", error);
    }
    setLoading(false);
  };

  
  useEffect(() => {
    const fetchData = async () => {
      await getCurrCustomer(dispatch);
    };
    fetchData();
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleDataPerPageChange = (num:number) => {
    setDataPerPage(Number(num));
    setCurrentPage(1);
  };

   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (user?._id){
      fetchOrder(user?._id);
    }
  }, [currentPage, dataPerPage,user]);

  return (
    <div className="w-full rounded-lg min-h-screen bg-white px-4 py-2 sm:px-6 sm:py-4 ">
      <UserDropdown />
      <h1 className="md:text-xl text-md font-semibold mb-6 text-gray-800">Purchase History</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap my-6 ">
      <div className="flex w-full sm:w-fit ">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-r-none rounded-l-md px-4 py-2 w-full"
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchOrder(user?._id);
            }
          }}
        />
        <div onClick={()=>{fetchOrder(user?._id)}} className="cursor-pointer bg-webred px-4 py-2 flex justify-center items-center text-white rounded-l-none rounded-r-md text-lg"><IoSearchOutline/></div>
        </div>
        <div className="w-full sm:w-fit flex flex-col items-start flex-wrap">
          <button onClick={()=>setShowDataPerPage((prev)=>!prev)} className="flex items-center border px-4 py-2 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg">
          <span>{dataPerPage} Data per page</span><span> {
              showDataPerPage ? <FaChevronDown className="ml-2"/> : <FaChevronRight className="ml-2"/>
       }</span>
          </button>
          <div className="relative w-full" >
           <div 
        className={`${!showDataPerPage && "hidden"} absolute top-full mt-2 z-10 flex px-2 py-2 sm:px-0 flex-col justify-center items-start border-2 rounded-lg bg-gray-200`}
      >
        <button 
          onClick={() => handleDataPerPageChange(6)} 
          className={`md:text-md w-full text-sm px-4 py-2 rounded-lg border-b ${dataPerPage === 6 ? "bg-webred text-white" : "bg-gray-200 text-black"}`}
        >
          6 Data Per Page
        </button>
        <button 
          onClick={() => handleDataPerPageChange(12)} 
          className={`md:text-md w-full text-sm px-4 py-2 rounded-lg border-b ${dataPerPage === 12 ? "bg-webred text-white" : "bg-gray-200 text-black"}`}
        >
          12 Data Per Page
        </button>
        <button 
          onClick={() => handleDataPerPageChange(24)} 
          className={`md:text-md w-full text-sm px-4 py-2 rounded-lg ${dataPerPage === 24 ? "bg-webred text-white" : "bg-gray-200 text-black"}`}
        >
          24 Data Per Page
        </button>
      </div>
      </div>
        </div>
      </div>
       {loading?(
              <div className="w-full flex justify-center items-center ">
              <SpinnerLoader/>
            </div>
            ):(
              <>
               <div className="overflow-x-auto mb-4 shadow-md rounded-lg">
        <div className="w-full border-collapse">
          <div className="bg-white">
            {
              orders && orders.length === 0 && (
                <div className="flex gap-1 justify-center items-center " ><AiFillProduct/><span>No purchase history found</span></div>
              )
            }
            {orders && orders.map((order) => (
              <div
                key={order._id}
                className="border-t border-zinc-300 hover:bg-gray-100 sm:p-4 flex flex-col gap-4 sm:flex-row justify-between transition duration-200"
              >
              <div className="flex flex-col px-4 sm:w-1/3 overflow-x-hidden" >
              <div className="text-gray-700">
              <span className="text-zinc-700 font-semibold" >Order id : </span><span className="text-wrap " >{order.razorpayOrderId}</span>
              </div>
               
                <div className="text-gray-700 capitalize "><span className="text-zinc-700 font-semibold" >Method : </span> {order.method}</div>
                <div className="text-gray-600 capitalize ">
                  <span className="text-zinc-700 font-semibold" >Date and Time : </span>
                  {formatDateTime(order.createdAt)}
                </div>
                </div>
                <div className="sm:w-1/3 px-4 sm:px-0 flex xl:gap-2 xl:justify-between md:justify-start xl:flex-row flex-col items-start">
                  <div className="text-gray-700  capitalize"><div className="flex gap-1 justify-start items-center"><span className="text-zinc-700 font-semibold " >Total Amount : </span> <span>{order.method==="razorpay"?<FaRupeeSign />:<FaCoins/>}</span> <span>{order.totalAmount}</span></div></div>
                <div
                  className={`justify-start ${
                    order.status === "paid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                <div className="text-start font-semibold capitalize" >
                 <span className="text-zinc-700" >Status : </span>
                  {order.status==="pending"?"Fail":order.status}
                </div>
               
                </div>
                </div>
                 
                <div className="px-4 my-2 sm:my-0 flex sm:justify-center items-start" > <button onClick={()=>{router.push(`/user-profile/purchase-history/${order._id}`);}} className="px-4 py-2 border-1 border-[#8D529C] rounded-lg text-[#8D529C] hover:text-white hover:bg-[#8D529C]"><div className="flex gap-2 justify-start items-center"><span className="block sm:block md:hidden lg:block" >View Order</span> <span><IoEyeOutline/></span></div> </button> </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {totalPages > 0 && orders.length>0 && (
        <div className="z-index-1 flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center">
        <div className="text-[#999999] md:w-1/3 ">Showing {(((currentPage-1)*dataPerPage)+1)} to {((currentPage-1)*dataPerPage+dataPerPage)>totalOrder?totalOrder:((currentPage-1)*dataPerPage+dataPerPage)}  of {totalOrder} Entries </div>
        <div className="md:w-1/3 flex justify-center items-center gap-4 my-4">
          <Button
            size="sm"
            disabled={currentPage === 1}
            variant="flat"
            className={`${
              currentPage === 1 ? "opacity-70" : "hover:bg-webred-light"
            } bg-webred text-white rounded-md font-bold`}
            onPress={() =>
              setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
            }
          >
            Prev
          </Button>
          <Pagination
            color="success"
            classNames={{
              item: "w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-md",
              cursor:
                "bg-webred hover:bg-webred-light text-white rounded-md font-bold",
            }}
            total={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            initialPage={1}
          />
          <Button
            size="sm"
            disabled={currentPage === totalPages}
            variant="flat"
            className={`${
              currentPage === totalPages
                ? "opacity-70"
                : "hover:bg-webred"
            } bg-webred-light text-white rounded-md font-bold`}
            onPress={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
          >
            Next
          </Button>
        </div>
        <div className="md:w-1/3"></div>
        </div>
      )}
</>
        )}
     
    </div>
  );
};

export default ProductList;

"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {Spinner,Button,Pagination} from "@nextui-org/react";
import { getCurrCustomer } from "@/app/redux/feature/user/api";
import { FaRupeeSign } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import {useRouter} from 'next/navigation'
import instance from "@/utils/axios";
import {formatDateTime} from '@/utils/DateFormat'

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
  const handleDataPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDataPerPage(Number(e.target.value));
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
    <div className="w-full rounded-lg min-h-screen overflow-hidden bg-white px-2 py-1 md:px-6 md:py-4">
      <h1 className="md:text-xl text-md font-semibold mb-6 text-gray-800">Purchase History</h1>
      <div className="flex justify-between items-center gap-4 flex-wrap my-6 ">
      <div className="flex">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-r-none rounded-l-md px-4 py-2 w-full max-w-sm"
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
        <div className="flex items-center flex-wrap gap-4">
          <div>
            <select
              className="border rounded px-4 py-2"
              onChange={handleDataPerPageChange}
              value={dataPerPage}
            >
              <option value={6}>6 Data per page</option>
              <option value={12}>12 Data per page</option>
              <option value={24}>24 Data per page</option>
            </select>
          </div>
        </div>
      </div>
       {loading?(
              <div className="w-full flex justify-center items-center ">
              <Spinner color="danger" size="lg" />
            </div>
            ):(
              <>
               <div className="overflow-x-auto mb-4 shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-[#F1F1F1] text-black">
            <tr>
              <th className="md:px-6 md:py-3 border-b text-sm font-medium tracking-wider">Order id</th>
              <th className="md:px-6 md:py-3 border-b text-sm font-medium tracking-wider">Amount</th>
              <th className="md:px-6 md:py-3 border-b text-sm font-medium tracking-wider">Method</th>
              <th className="md:px-6 md:py-3 border-b text-sm font-medium tracking-wider">Date</th>
              <th className="md:px-6 md:py-3 border-b text-sm font-medium tracking-wider">Status</th>
              <th className="md:px-6 md:py-3 border-b text-center text-sm font-medium tracking-wider">Order Details</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-100 transition duration-200"
              >
                <td className="md:px-6 md:py-4 text-gray-700">{order.razorpayOrderId}</td>
                <td className="md:px-6 md:py-4 text-gray-700"><div className="flex gap-1 justify-start items-center"><span><FaRupeeSign /></span> <span>{order.totalAmount}</span></div></td>
                <td className="md:px-6 md:py-4 text-gray-700">{order.method}</td>
                <td className="md:px-6 md:py-4 text-gray-600">
                  {formatDateTime(order.createdAt)}
                </td>
                <td
                  className={`md:px-6 md:py-4 font-semibold ${
                    order.status === "paid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {order.status}
                </td>
                <td className="md:px-6 md:py-4 flex justify-center items-center" > <button onClick={()=>{router.push(`/user-profile/purchase-history/${order._id}`);}} className="px-4 py-2 border-1 border-[#8D529C] rounded-lg text-[#8D529C] hover:text-white hover:bg-[#8D529C]"><div className="flex gap-2 justify-start items-center"><span>View Order</span> <span><IoEyeOutline/></span></div> </button> </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="z-index-1 flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center">
        <div className="text-[#999999] md:w-1/3 ">Showing {((currentPage-1)*dataPerPage)+1} to {((currentPage-1)*dataPerPage+dataPerPage)>totalOrder?totalOrder:((currentPage-1)*dataPerPage+dataPerPage)}  of {totalOrder} Entries </div>
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

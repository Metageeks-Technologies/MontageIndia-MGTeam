"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getCurrCustomer } from "@/app/redux/feature/user/api";
import instance from "@/utils/axios";

interface Order {
  _id: string;
  totalAmount: number;
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
  const [items] = useState(10);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.user?.user);
  console.log("user", user);

  const fetchOrder = async (_id: string) => {
    try {
      const response = await instance.get(`/orders/${_id}`);
      setOrders(response.data.orders);  
      console.log("data", response);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCurrCustomer(dispatch);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      fetchOrder(user._id);
    }
  }, [user]);

  const indexOfLastOrder = currentPage * items;
  const indexOfFirstOrder = indexOfLastOrder - items;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(orders.length / items);

  return (
    <div className="w-full px-4 h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Purchase History</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
            <tr>
              <th className="px-6 py-3 border-b text-sm font-medium tracking-wider">Total Amount</th>
              <th className="px-6 py-3 border-b text-sm font-medium tracking-wider">Status</th>
              <th className="px-6 py-3 border-b text-sm font-medium tracking-wider">Method</th>
              <th className="px-6 py-3 border-b text-sm font-medium tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-100 transition duration-200"
              >
                <td className="px-6 py-4 text-gray-700">{order.totalAmount} {order.currency}</td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    order.status === "paid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {order.status}
                </td>
                <td className="px-6 py-4 text-gray-700">{order.method}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Pre
        </button>
        <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
        <button
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;

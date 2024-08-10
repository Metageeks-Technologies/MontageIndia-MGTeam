"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getCurrCustomer } from "@/app/redux/feature/user/api";
import instance from "@/utils/axios";

interface Product {
  _id: string;
  name: string;
  amount: number;
  mediaType: string;
}

interface Order {
  _id: string;
  items: Product[];
  status: string;
  totalAmount: number;
  createdAt: string;
  paymentDetails: {
    paymentDate: string;
  };
}

const ProductList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.user?.user);

  const fetchOrder = async (_id: string) => {
    try {
      const response = await instance.get(`/orders/${_id}`);
      setOrders(response.data.purchaseHistory);
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

  return (
    <div className="w-full px-4 h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Purchase History</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
            <tr>
              <th className="px-6 py-3 border-b text-sm font-medium tracking-wider">Order Name</th>
              <th className="px-6 py-3 border-b text-sm font-medium tracking-wider">MediaType</th>
              <th className="px-6 py-3 border-b text-sm font-medium tracking-wider">Price</th>
              <th className="px-6 py-3 border-b text-sm font-medium tracking-wider">Status</th>
              <th className="px-6 py-3 border-b text-sm font-medium tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {orders.map((order) =>
              order.items.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 text-gray-700 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-gray-700">{product.mediaType}</td>
                  <td className="px-6 py-4 text-gray-700">${product.amount}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      order.status === "completed" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;

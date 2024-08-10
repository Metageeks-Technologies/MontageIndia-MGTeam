"use client";
import instance from "@/utils/axios";
import React, { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  email: string;
  phone: string;
  rp_order_id: string;
  rp_payment_id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
}

const Page = () => {
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`payment/transactions`);
      setTransaction(response.data.transactions);
      console.log("transaction", response);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container ">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Transaction History
      </h1>
      <div className="bg-white shadow-md rounded-lg">
        <div className="overflow-x-auto lg:overflow-visible">
          <table className="min-w-full text-sm text-left text-gray-900">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Phone</th>
                <th scope="col" className="px-6 py-3">Razorpay Order ID</th>
                <th scope="col" className="px-6 py-3">Razorpay Payment ID</th>
                <th scope="col" className="px-6 py-3 hidden md:table-cell">Amount</th>
                
                <th scope="col" className="px-6 py-3">Method</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">Loading...</td>
                </tr>
              ) : (
                transaction.map((trans) => (
                  <tr key={trans._id} className="bg-white border-b hover:bg-gray-50">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {trans.email}
                    </th>
                    <td className="px-6 py-4">{trans.phone}</td>
                    <td className="px-6 py-4">{trans.rp_order_id}</td>
                    <td className="px-6 py-4">{trans.rp_payment_id}</td>
                    <td className="px-6 py-4 hidden md:table-cell">{trans.amount} {trans.currency} </td>
                    
                    <td className="px-6 py-4">{trans.method}</td>
                    <td className="px-6 py-4">{trans.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;

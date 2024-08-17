"use client";
import instance from "@/utils/axios";
import React, { useEffect, useState } from "react";

interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string ;
  status: string;
}

const Page = () => {
  const [subscription, setSubscription] = useState<Subscription[]>([]);

  const fetchSubscription = async () => {
    try {
      const response = await instance.get(`/subscription/history`);
      setSubscription(response.data.subscriptionHistory);
      console.log("subscription", response);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Subscription History</h1>
      <div className="bg-white shadow-md rounded-lg">
        <div className="overflow-x-auto lg:overflow-visible">
          <table className="min-w-full text-sm text-left text-gray-900">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">User ID</th>
                <th scope="col" className="px-6 py-3">Plan ID</th>
                <th scope="col" className="px-6 py-3">Start Date</th>
                <th scope="col" className="px-6 py-3">End Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscription.map((sub, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{sub.userId}</td>
                  <td className="px-6 py-4">{sub.planId}</td>
                  <td className="px-6 py-4">{new Date(sub.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4">{sub.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;

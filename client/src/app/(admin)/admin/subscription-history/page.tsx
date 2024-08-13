"use client";
import instance from "@/utils/axios";
import { Pagination, Button, Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from "react";

interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const [subscription, setSubscription] = useState<Subscription[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataPerPage, setDataPerPage] = useState<number>(6);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchSubscription = async () => {
    try {
      const response = await instance.get(`/subscription/history`);
      setSubscription(response.data.subscriptionHistory);
      console.log("subscription", response);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDataPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDataPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Subscription History</h1>
      <div className="flex justify-between items-center gap-4 flex-wrap my-6">
        <input
          type="text"
          placeholder="Search"
          className="border rounded px-4 py-2 w-full max-w-sm"
          // value={searchTerm}
          // onChange={handleSearch}
        />
        <div className="flex items-center flex-wrap gap-4">
          <div>
            <select className="border rounded px-4 py-2" >
              <option value={6}>6 Data per page</option>
              <option value={12}>12 Data per page</option>
              <option value={24}>24 Data per page</option>
            </select>
          </div>
        </div>
      </div>
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
              {subscription.map((sub) => (
                <tr key={sub._id} className="bg-white border-b hover:bg-gray-50">
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

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 my-4 ">
            <Button
              size="sm"
              disabled={currentPage === 1}
              variant="flat"
              className={`${
                currentPage === 1 ? 'opacity-70' : 'hover:bg-webgreenHover'
              } bg-webgreen-light text-white rounded-md font-bold`}
              onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
            >
              Prev
            </Button>
            <Pagination
              color="success"
              classNames={{
                item: 'w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-md',
                cursor: 'bg-webgreen hover:bg-webgreen text-white rounded-md font-bold',
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
                currentPage === totalPages ? 'opacity-70' : 'hover:bg-webgreenHover'
              } bg-webgreen-light text-white rounded-md font-bold`}
              onPress={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            >
              Next
            </Button>
          </div>
        )}


      </div>
    </div>
  );
};

export default Page;

"use client";
import instance from "@/utils/axios";
import { Pagination, Button, Spinner } from '@nextui-org/react';
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataPerPage, setDataPerPage] = useState<number>(6);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`payment/transactions`, {
        params: {
          searchTerm,
          currentPage,
          dataPerPage,
        },
      });
      setTransaction(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, dataPerPage, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDataPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDataPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Transaction History
      </h1>
     
      <div className="flex justify-between items-center gap-4 flex-wrap my-6">
        <input
          type="text"
          placeholder="Search"
          className="border rounded px-4 py-2 w-full max-w-sm"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="flex items-center flex-wrap gap-4">
          <div>
            <select className="border rounded px-4 py-2" value={dataPerPage} onChange={handleDataPerPageChange}>
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
                <td colSpan={ 7 } className="text-center py-4">
                  <Spinner label="Loading..." color="success" />
                </td>
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

      {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 my-4">
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
              onChange={(page) => setCurrentPage(page)}
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
  );
};

export default Page;

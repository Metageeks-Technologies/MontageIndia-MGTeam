"use client";
import instance from "@/utils/axios";
import { Pagination, Button, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { SpinnerLoader } from "@/components/loader/loaders";
import { IoCloseOutline } from "react-icons/io5";
import * as XLSX from "xlsx";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDataPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDataPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const ExportTransactions = async () => {
    setIsExporting(true);
    // get all data from the database
    const response = await instance.get("/payment/transactions", {
      params: { searchTerm: "", currentPage: 1, dataPerPage: 1000 },
      withCredentials: true,
    });
    const ws = XLSX.utils.json_to_sheet(response.data.transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "Transactions.xlsx");
    setIsExporting(false);
  };

  return (
    <div className="container p-4 min-h-screen bg-pureWhite-light rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <button
          className={`px-4 py-2 bg-red-500 text-white rounded ${
            isExporting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
          }`}
          onClick={ExportTransactions}
          disabled={isExporting}
        >
          {isExporting
            ? "Exporting transaction history..."
            : "Export Transaction History"}
        </button>
      </div>

      {/* one horixonal line */}
      <hr className="border-t border-gray-300 mb-4" />

      <div className="flex items-center justify-between space-x-2 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Transaction"
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded px-4 py-2 w-full pr-10" // Adjust padding-right for the clear icon
          />

          {/* Clear Search Button */}
          {searchTerm && (
            <div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setSearchTerm("")} // Clears the search term
            >
              <IoCloseOutline size={20} />
            </div>
          )}
        </div>

        <div className="mb-4">
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

      <div className="bg-white shadow-md rounded-lg relative overflow-x-auto ">
        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>

              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Razorpay Order ID
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Razorpay Payment ID
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Method
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <SpinnerLoader />
                </td>
              </tr>
            ) : transaction && transaction.length > 0 ? (
              transaction.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm font-medium text-gray-900">
                      {item.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{item.phone}</div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">
                      {item.rp_order_id}
                    </div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">
                      {item.rp_payment_id}{" "}
                    </div>
                  </td>{" "}
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">
                      {item.amount} {item.currency}
                    </div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{item.method}</div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{item.status}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <p className="text-gray-500">No Transactions Found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <p>
              Showing {dataPerPage * (currentPage - 1) + 1} to{" "}
              {dataPerPage * currentPage} of {totalPages * dataPerPage} Entries
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded ${
                  currentPage === index + 1
                    ? "bg-red-500 text-white"
                    : "bg-white"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

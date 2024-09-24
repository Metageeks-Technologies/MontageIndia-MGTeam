"use client";
import instance from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { SpinnerLoader } from "@/components/loader/loaders";
import { IoCloseOutline } from "react-icons/io5";
interface CustomerList {
  _id: string;
  name: string;
  phone: string;
  username: string;
  email: string;
  isDeleted: boolean;
  createdAt: string;
}

const Page = () => {
  const [data, setData] = useState<CustomerList[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataPerPage, setDataPerPage] = useState<number>(6);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await instance.get("user/getAll", {
        params: {
          searchTerm,
          currentPage,
          dataPerPage,
        },
      });
      setData(response.data.customers);
      setTotalPages(response.data.totalPages);
      //   console.log(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, dataPerPage, searchTerm]);

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

  return (
    <div className="container p-4 min-h-screen bg-pureWhite-light rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customer Activity</h1>
      </div>

      {/* one horixonal line */}
      <hr className="border-t border-gray-300 mb-4" />

      <div className="flex items-center justify-between space-x-2 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search "
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded px-4 py-2 flex-grow"
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

      <div className="bg-white shadow-md rounded-lg relative overflow-x-auto ">
        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead>
            <tr>
              {/* <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Username
              </th> */}

              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Phone No
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Deleted
              </th>
              {/* <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <SpinnerLoader />
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm font-medium text-gray-900">
                      {item.username}
                    </div>
                  </td> */}
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{item.email}</div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{item.phone} </div>
                  </td>{" "}
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">
                      {new Date(item.createdAt).toLocaleDateString()}{" "}
                    </div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">
                      {item.isDeleted ? "Yes" : "No"}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <p className="text-gray-500">No Data Found</p>
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

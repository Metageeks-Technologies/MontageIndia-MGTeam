"use client";
import instance from '@/utils/axios';
import { Pagination, Button, Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

interface CustomerActivity {
  _id: string;
  name: string;
  phone: string;
  username: string;
  email: string;
  isDeleted: boolean;
  createdAt: string;
}

const Page = () => {
  const [data, setData] = useState<CustomerActivity[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataPerPage, setDataPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await instance.get('user/getAll', {
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
      console.error('Error fetching users:', error);
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
    <div className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Customer Activity</h1>
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
            <select className="border rounded px-4 py-2" onChange={handleDataPerPageChange} value={dataPerPage}>
              <option value={6}>6 Data per page</option>
              <option value={12}>12 Data per page</option>
              <option value={24}>24 Data per page</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <div className="relative shadow-md sm:rounded-lg mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-900">
              <thead className="text-xs text-black uppercase bg-gray-200">
                <tr className="border">
                  <th scope="col" className="px-4 py-3 sm:px-6">Username</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Name</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Email</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Phone No</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Created At</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Deleted</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr>
                   <td colSpan={ 7 } className="text-center py-4">
                     <Spinner label="Loading..." color="success" />
                   </td>
                 </tr>
                ) : data && data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-100 text-black">
                      <td className="px-4 py-4 sm:px-6">{item.username}</td>
                      <td className="px-4 py-4 sm:px-6 font-medium whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-4 py-4 sm:px-6">{item.email}</td>
                      <td className="px-4 py-4 sm:px-6">{item.phone}</td>
                      <td className="px-4 py-4 sm:px-6">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4 sm:px-6">{item.isDeleted ? 'Yes' : 'No'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No Data Found
                    </td>
                  </tr>
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

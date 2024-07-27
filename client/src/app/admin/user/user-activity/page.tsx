import React from "react";

interface UserActivity {
  _id: string;
  name: string;
  email: string;
  category: string;
}

const dummyData: UserActivity[] = [
  { _id: "1", name: "John Doe", email: "john.doe@example.com", category: "Admin" },
  { _id: "2", name: "Jane Smith", email: "jane.smith@example.com", category: "User" },
  { _id: "3", name: "Alice Johnson", email: "alice.johnson@example.com", category: "Moderator" },
  { _id: "1", name: "John Doe", email: "john.doe@example.com", category: "Admin" },
  { _id: "2", name: "Jane Smith", email: "jane.smith@example.com", category: "User" },
  { _id: "3", name: "Alice Johnson", email: "alice.johnson@example.com", category: "Moderator" },
  { _id: "1", name: "John Doe", email: "john.doe@example.com", category: "Admin" },
  { _id: "2", name: "Jane Smith", email: "jane.smith@example.com", category: "User" },
  { _id: "3", name: "Alice Johnson", email: "alice.johnson@example.com", category: "Moderator" },
];

const Page = () => {
  

  return (
    <div className="container mx-auto p-4 sm:pl-64 h-full">
         <h1 className="text-2xl font-bold mb-4">User Activity</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="overflow-x-scroll lg:overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-900 dark:text-gray-400">
            <thead className="text-xs text-black uppercase bg-gray-50  ">
              <tr className="border">
                <th scope="col" className="px-4 py-3 sm:px-6">Name</th>
                <th scope="col" className="px-4 py-3 sm:px-6">Email</th>
                <th scope="col" className="px-4 py-3 sm:px-6">Category</th>
                <th scope="col" className="px-4 py-3 sm:px-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((user) => (
                <tr
                  key={user._id}
                  className="border-b  hover:bg-gray-200 text-black"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 sm:px-6 font-medium whitespace-nowrap "
                  >
                    {user.name}
                  </th>
                  <td className="px-4 py-4 sm:px-6">{user.email}</td>
                  <td className="px-4 py-4 sm:px-6">{user.category}</td>
                  <td className="px-4 py-4 sm:px-6 text-centre">
                    <button
                      
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      View
                    </button>
                  </td>
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

"use client";
import { FC, useState, useEffect } from "react";
import instance from "@/utils/axios";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getCurrCustomer } from "@/app/redux/feature/user/api";

interface Subscription {
  PlanId: string;
  credits: number;
  planValidity: string;
  status: string;
  subscriptionId: string;
}


interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  _id: string;
  subscription: Subscription;
}

const Home: FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [currentField, setCurrentField] = useState<"Name" | "Email" | "">("");
  const [isInputChanged, setIsInputChanged] = useState(false);
  const dispatch=useAppDispatch()
  const users = useAppSelector((state: any) => state.user);
  console.log("cuurent",users)

  const fetchUser = async () => {
    try {
      const response = await instance.get(`/user/getCurrent`);
      console.log("user", response);
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      notifyError("Failed to fetch user data");
    }
  };

  const updateUser = async () => {
    try {
      const payload =
        currentField === "Name"
          ? { name: updatedName }
          : { email: updatedEmail };
      const response = await instance.patch(`/user/update`, payload);
      if (response.data && response.data.success) {
        fetchUser();
        setIsPopupOpen(false);
        notifySuccess("User data updated successfully");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      notifyError("Failed to update user data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsInputChanged(true);
    if (currentField === "Name") {
      setUpdatedName(e.target.value);
    } else {
      setUpdatedEmail(e.target.value);
    }
  };

   useEffect(() => {
    fetchUser();
    getCurrCustomer(dispatch);
    
  }, []);

  return (
    <>
      <div>
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-85 flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-[25rem] relative">
            <h2 className="text-xl font-bold mb-4">Edit {currentField}</h2>
            <div className="mb-4">
              <label className="block text-gray-700">{currentField}</label>
              <input
                type="text"
                value={currentField === "Name" ? updatedName : updatedEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <div className=" flex items-center h-10 w-10 justify-center absolute top-4 right-5 rounded-full hover:bg-gray-200">
                <RxCross2
                  onClick={() => setIsPopupOpen(false)}
                  className=" h-5 w-5  cursor-pointer"
                />
              </div>
              <button
                onClick={updateUser}
                className={`w-full py-2 rounded-3xl ${
                  isInputChanged
                    ? "bg-webgreen text-white"
                    : "bg-neutral-300 text-gray-700"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}

      
        <h2 className="text-4xl font-bold">Profile</h2>
        <p className="py-6">User details</p>
        <div className="border border-gray-200 pt-4">
          {user && (
            <>
              <div className="flex justify-between items-center mx-6 py-2 border-b">
                <div className="text-gray-700">Name</div>
                <div className="text-gray-700">{user.name}</div>
                <button
                  onClick={() => {
                    setCurrentField("Name");
                    setUpdatedName(user.name);
                    setIsPopupOpen(true);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>
              </div>
              <div className="flex justify-between items-center mx-6 py-3 border-b">
                <div className="text-gray-700">User ID</div>
                <div className="text-gray-700">{user._id}</div>
                <button />
              </div>
              <div className="flex justify-between items-center mx-6 py-3 border-b">
                <div className="text-gray-700">User Name</div>
                <div className="text-gray-700">{user.username}</div>
                <button />
              </div>
              <div className="flex justify-between items-center mx-6 py-3 border-b">
                <div className="text-gray-700">Password</div>
                <div className="text-gray-700">********</div>
                <button
                  onClick={() => router.push(`/user-profile/${user._id}`)}
                  className="text-blue-600"
                >
                  Edit
                </button>
              </div>
              <div className="flex justify-between items-center mx-6 py-3 border-b">
                <div className="text-gray-700">E-mail</div>
                <div className="text-gray-700">{user.email}</div>
                <button
                  onClick={() => {
                    setCurrentField("Email");
                    setUpdatedEmail(user.email);
                    setIsPopupOpen(true);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
        </div>

        <div className="mt-8">
        <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Subscription plan</div>
        <div onClick={() => router.push(`/subscription`)} className="text-md cursor-pointer px-4 py-2 bg-var1 text-white rounded-3xl hover:bg-var1-light">Buy More credits</div>
        </div>
        
        <div className="border border-gray-200 mt-2">
        {user && (
          <>
            {/* User Details */}
            <div className="flex justify-between items-center mx-6 py-3 border-b">
              <div className="text-gray-700">Credits</div>
              <div className="text-gray-700">{user.subscription.credits}</div>
            </div>
            <div className="flex justify-between items-center mx-6 py-3 border-b">
              <div className="text-gray-700">Plan Validity</div>
              <div className="text-gray-700">  {new Date(user.subscription.planValidity).toLocaleDateString()}</div>
            </div>
            <div className="flex justify-between items-center mx-6 py-3 border-b">
              <div className="text-gray-700">Status</div>
              <div className="text-gray-700">{user.subscription.status}</div>
            </div>
          </>
        )}
      </div>
      </div>


        <div className="mt-10 pb-2">
          <h1 className="text-lg font-bold">Delete my Account</h1>
          <div className="border w-full mt-2 p-6 flex flex-col gap-2">
            <p className="text-sm text-gray-700">
              This will remove all of your personal data forever.
            </p>
            <p className="text-blue-600 hover:underline cursor-pointer">
              Delete my Account
            </p>
          </div>
        </div>
        
        </>
  
  );
};

export default Home;

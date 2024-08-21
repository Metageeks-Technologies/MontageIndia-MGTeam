"use client";
import { FC, useState, useEffect } from "react";
import instance from "@/utils/axios";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import { BiEdit } from "react-icons/bi";
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
    <div className="w-full min-h-full flex flex-col rounded-lg overflow-hidden bg-white">
      <div className="mb-8">
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
        <h2 className="text-4xl font-bold mb-2">Profile</h2>
        <hr className="mb-4" />
        <p className="mb-4">User details</p>
          {user && (
            <div className="w-full min-h-fit flex md:flex-row flex-col-reverse gap-4 justify-between items-center">
            <div className="md:w-3/4 border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center bg-[#FFECEC] px-4 py-3 border-b">
                <div className="text-black">Name</div>
                <div className="text-black">{user.name}</div>
                <div className="w-1/3 flex justify-end items-center">
                <button
                  onClick={() => {
                    setCurrentField("Name");
                    setUpdatedName(user.name);
                    setIsPopupOpen(true);
                  }}
                  className="bg-white px-2 py-1 rounded-lg border-1 border-gray-400 flex justify-end items-center gap-2"
                >
                  <span className="text-black">Edit</span><span className="text-webred"><BiEdit /></span>
                </button>
                </div>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <div className="text-black w-1/3">User ID</div>
                <div className="text-black w-1/3">{user._id}</div>
                <div className="w-1/3"></div>
              </div>
              <div className="flex justify-between items-center bg-[#FFECEC] px-4 py-3 border-b">
                <div className="text-black w-1/3 ">User Name</div>
                <div className="text-black w-1/3">{user.username}</div>
                <div className="w-1/3"></div>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <div className="text-black w-1/3">Password</div>
                <div className="text-black w-1/3">********</div>
                <div className="w-1/3 flex justify-end items-center">
                <button
                  onClick={() => router.push(`/user-profile/${user._id}`)}
                  className=" bg-white px-2 py-1 rounded-lg border-1 border-gray-400 flex justify-end items-center gap-2"
                >
                 <span className="text-black">Edit</span><span className="text-webred"><BiEdit /></span>
                </button>
                </div>
              </div>
              <div className="flex justify-between items-center bg-[#FFECEC] px-4  py-3 border-b">
                <div className="text-black w-1/3">E-mail</div>
                <div className="text-black w-1/3">{user.email}</div>
                <div className="w-1/3 flex justify-end items-center">
                <button
                  onClick={() => {
                    setCurrentField("Email");
                    setUpdatedEmail(user.email);
                    setIsPopupOpen(true);
                  }}
                  className=" bg-white px-2 py-1 rounded-lg border-1 border-gray-400 flex justify-end items-center gap-2"
                >
                <span className="text-black">Edit</span><span className="text-webred"><BiEdit /></span>
                </button>
                </div>
              </div>
            </div>
            <div className="md:w-1/4 bg-[#FFECEC] min-h-fit flex p-16 rounded-lg justify-center items-center">
              <svg className="w-full" xmlns="http://www.w3.org/2000/svg" width="138" height="138" viewBox="0 0 138 138" fill="none">
<path d="M68.5917 0C50.3275 0.108075 32.8511 7.45331 19.9936 20.4256C7.13603 33.3979 -0.053735 50.9389 0.000302414 69.2035C0.0543398 87.4682 7.34777 104.966 20.2819 117.862C33.216 130.758 50.7354 138 69 138C87.2646 138 104.784 130.758 117.718 117.862C130.652 104.966 137.946 87.4682 138 69.2035C138.054 50.9389 130.864 33.3979 118.006 20.4256C105.149 7.45331 87.6725 0.108075 69.4083 0H68.5917ZM68.5917 35.1127C76.7852 35.2206 84.6034 38.565 90.3401 44.4161C96.0768 50.2672 99.2663 58.15 99.2123 66.3441C99.1584 74.5381 95.8656 82.3783 90.0524 88.1534C84.2392 93.9285 76.3776 97.1698 68.1834 97.1698C59.9892 97.1698 52.1277 93.9285 46.3145 88.1534C40.5013 82.3783 37.2084 74.5381 37.1545 66.3441C37.1006 58.15 40.29 50.2672 46.0267 44.4161C51.7634 38.565 59.5817 35.2206 67.7751 35.1127H68.5917ZM22.8639 116.974C30.213 107.448 39.3314 102.684 50.2189 102.684H87.7811C98.6686 102.684 107.787 107.448 115.136 116.974C102.69 128.807 86.1732 135.406 69 135.406C51.8268 135.406 35.31 128.807 22.8639 116.974Z" fill="#F5BEBE"/>
</svg>
            </div>
            </div>
        
          )}
        </div>

        <div className="mb-8">
        <div className="flex justify-between items-center">
        <div className="text-xl font-bold">Subscription plan</div>
        <div onClick={() => router.push(`/subscription`)} className="text-md cursor-pointer px-8 py-2 bg-webred text-white rounded-lg hover:bg-[#fd626211]">Buy More credits</div>
        </div>
        
        <div className="border rounded-lg border-gray-200 mt-2">
        {user && (
          <>
            {/* User Details */}
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <div className="text-black">Plan Name</div>
              <div className="text-black font-semibold">Basic Plan</div>
            </div>
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <div className="text-black">Credits</div>
              <div className="text-black font-semibold">{user.subscription.credits}</div>
            </div>
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <div className="text-black">Plan Validity</div>
              <div className="text-black font-semibold">  {new Date(user.subscription.planValidity).toLocaleDateString()}</div>
            </div>
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <div className="text-black">Status</div>
              <div className="text-green ont-semibold ">{user.subscription.status}</div>
            </div>
          </>
        )}
      </div>
      </div>
        <div className="mt-10 pb-2">
          <h1 className="text-lg font-bold mb-1">Delete my Account</h1>
          <div className="w-full flex flex-col">
            <p className="text-sm text-black">
              This will remove all of your personal data forever.
            </p>
            <p className="text-webred text-sm font-bold underline cursor-pointer">
              Delete my Account
            </p>
          </div>
        </div>
    </div>
      
        
        </>
  
  );
};

export default Home;

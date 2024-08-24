"use client";
import { FC, useState, useEffect } from "react";
import instance from "@/utils/axios";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import { BiEdit } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getCurrCustomer } from "@/app/redux/feature/user/api";
import Swal from "sweetalert2";

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
  image:string;
  email: string;
  phone: string;
  username: string;
  _id: string;
  subscription: Subscription;
}

const Home: FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
      // notifyError("Failed to fetch user data");
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch user data',
      } );
    }
  };
   useEffect(() => {
    fetchUser();
    getCurrCustomer(dispatch);
    
  }, []);

  return (
    <>
    <div className="w-full px-6 py-4 min-h-full flex flex-col rounded-lg overflow-hidden bg-white">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <hr className="mb-4" />
          {user && (
            <div className="w-full min-h-fit flex md:flex-row flex-col-reverse gap-4 justify-between items-center">
            <div className="md:w-3/4 border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center bg-gray-100 border-gray-300 px-4 py-3 border-b">
                <div className="w-1/3 text-black">Name</div>
                <div className="w-1/3 text-black">{user.name}</div>
                {/* <div className="w-1/3 flex justify-end items-center">
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
                </div> */}
              </div>
              {/* <div className="flex justify-between items-center px-4 py-3 border-b">
                <div className="text-black w-1/3">User ID</div>
                <div className="text-black w-1/3">{user._id}</div>
                <div className="w-1/3"></div>
              </div> */}
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <div className="text-black w-1/3 ">User Name</div>
                <div className="text-black w-1/3">{user.username}</div>
                {/* <div className="w-1/3"></div> */}
              </div>
               <div className="flex justify-between bg-gray-100 border-gray-300 items-center px-4  py-3 border-b">
                <div className="text-black w-1/3">E-mail</div>
                <div className="text-black w-1/3">{user.email}</div>
                {/* <div className="w-1/3 flex justify-end items-center">
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
                </div> */}
              </div>
              <div className="flex justify-between  items-center px-4 py-3 border-b">
                <div className="text-black w-1/3">Password</div>
                <div className="text-black w-1/3">********</div>
                {/* <div className="w-1/3 flex justify-end items-center">
                <button
                  onClick={() => router.push(`/user-profile/change-password`)}
                  className=" bg-white px-2 py-1 rounded-lg border-1 border-gray-400 flex justify-end items-center gap-2"
                >
                 <span className="text-black">Edit</span><span className="text-webred"><BiEdit /></span>
                </button>
                </div> */}
              </div>
             
            </div>
            <div className="md:w-1/4 bg-gray-100 h-full p-4 rounded-lg flex justify-center items-center">
              <div className="w-40 h-40  rounded-full overflow-hidden ">
                <img className="w-full h-full object-cover" src={user.image} ></img>
              </div>
            </div>
            </div>
        
          )}
        </div>

        <div className="mb-8">
        <div className="flex justify-between items-center">
        <div className="text-xl font-bold">Subscription plan</div>
        <div onClick={() => router.push(`/user-profile/subscription`)} className="text-md cursor-pointer px-8 py-2 bg-webred text-white rounded-lg hover:bg-[#f46379ec]">Buy More credits</div>
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

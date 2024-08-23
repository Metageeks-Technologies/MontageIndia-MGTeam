"use client";
import { FC, useState, useEffect } from "react";
import instance from "@/utils/axios";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getCurrCustomer } from "@/app/redux/feature/user/api";
import { Spinner } from "@nextui-org/react";

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

interface Form {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSetting: FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [formData, setForm] = useState<Form>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const dispatch=useAppDispatch()
  const users = useAppSelector((state: any) => state.user);
  console.log("cuurent",users)

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/user/getCurrent`);
      console.log("user", response);
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setForm({
          name: response.data.user.name,
          email: response.data.user.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch user data",
        text: "",
      })
    }
  };

  const updateProfile = async () => {

    if(!formData.currentPassword && formData.name===user?.name && !formData.newPassword && !formData.confirmPassword){
     return ;
    }
    
    setUpdateLoader(true);
    try {
      let payload ={}
      if(formData.currentPassword && formData.newPassword && formData.confirmPassword){
        if(formData.newPassword === formData.confirmPassword){
          payload = {
            name: formData.name,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          }
        }else{
          setUpdateLoader(false);
          Swal.fire( {
            icon: 'error',
            title: 'Confirm password does not match',
            text: 'Please enter matching passwords',
        } );
          return;
        }
      }else{
        payload = {
          name: formData.name,
        }
      }
      console.log("payload",payload)
      
      const response = await instance.patch(`/user/update`,{ ...payload});
      if (response.data && response.data.success) {
        fetchUser();
        Swal.fire({
          icon: "success",
          title: "Profile Updated Successfully",
          text: "",
        });
        setUpdateLoader(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update user data",
        text: "",
      });
      setUpdateLoader(false);
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
      {/* Sidebar */}
        <h2 className="text-xl font-bold mb-2">Profile Settings</h2>
        <hr className="mb-4" />
        {loading && (<div className="flex justify-center items-center min-h-screen">
        <Spinner color="danger" size="lg" />
        </div>) }
          {!loading && user && (
            <>
            <div className="w-full min-h-fit mb-8 flex flex-col gap-4 justify-between items-center">
            <div className="w-full">
             <div className=" bg-[#F1F1F1] min-h-fit flex gap-4 p-8 rounded-lg justify-start items-center">
            <div>
            <svg className="w-full" xmlns="http://www.w3.org/2000/svg" width="138" height="138" viewBox="0 0 138 138" fill="none">
            <path d="M68.5917 0C50.3275 0.108075 32.8511 7.45331 19.9936 20.4256C7.13603 33.3979 -0.053735 50.9389 0.000302414 69.2035C0.0543398 87.4682 7.34777 104.966 20.2819 117.862C33.216 130.758 50.7354 138 69 138C87.2646 138 104.784 130.758 117.718 117.862C130.652 104.966 137.946 87.4682 138 69.2035C138.054 50.9389 130.864 33.3979 118.006 20.4256C105.149 7.45331 87.6725 0.108075 69.4083 0H68.5917ZM68.5917 35.1127C76.7852 35.2206 84.6034 38.565 90.3401 44.4161C96.0768 50.2672 99.2663 58.15 99.2123 66.3441C99.1584 74.5381 95.8656 82.3783 90.0524 88.1534C84.2392 93.9285 76.3776 97.1698 68.1834 97.1698C59.9892 97.1698 52.1277 93.9285 46.3145 88.1534C40.5013 82.3783 37.2084 74.5381 37.1545 66.3441C37.1006 58.15 40.29 50.2672 46.0267 44.4161C51.7634 38.565 59.5817 35.2206 67.7751 35.1127H68.5917ZM22.8639 116.974C30.213 107.448 39.3314 102.684 50.2189 102.684H87.7811C98.6686 102.684 107.787 107.448 115.136 116.974C102.69 128.807 86.1732 135.406 69 135.406C51.8268 135.406 35.31 128.807 22.8639 116.974Z" fill="#DDD"/>
            </svg>
            </div>
            <div className="flex flex-col gap-2">
            <div className="font-bold text-xl">Profile Picture</div>
            <div className="text-gray-500 text-md ">This will be displayed on your profile.</div>
            </div>
            </div>
            </div>
            <div className="w-full  rounded-lg overflow-hidden">
              <div className="w-full flex justify-between gap-4 items-center ">
               <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3 ">
                <label className="text-black">Full Name</label>
                <input value={formData.name} onChange={(e) => setForm({ ...formData, name: e.target.value })} type="text" className="w-full border bg-[#F1F1F1] border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3">
                <label className="text-black">User Name</label>
                <input disabled={true} value={user.username} type="text" className="w-full border bg-[#F1F1F1] border-gray-300 rounded-lg px-4 py-2" />
              </div>
              </div>
               <div className="w-full flex justify-between gap-4 items-center ">
               <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3 ">
                <label className="text-black">Email</label>
                <input disabled={true} value={user.email} onChange={(e) => setForm({ ...formData, email: e.target.value })} type="email" className="w-full border bg-[#F1F1F1] border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3 ">
                <label className="text-black">Current Password</label>
                <input value={formData.currentPassword} type="password" onChange={(e) => setForm({ ...formData, currentPassword: e.target.value })} className="w-full border bg-[#F1F1F1] border-gray-300 rounded-lg px-4 py-2" />
              </div>
              </div>
              <div className="w-full flex justify-between gap-4 items-center ">
               <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3 ">
                <label className="text-black">New Password</label>
                <input value={formData.newPassword} type="password" onChange={(e) => setForm({ ...formData, newPassword: e.target.value })} className="w-full border bg-[#F1F1F1] border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3 ">
                <label className="text-black">Confirm Password</label>
                <input value={formData.confirmPassword} type="password" onChange={(e) => setForm({ ...formData, confirmPassword: e.target.value })} className="w-full border bg-[#F1F1F1] border-gray-300 rounded-lg px-4 py-2" />
              </div>
              </div>
             
            </div>
            </div>
            <div className="flex justify-end items-center w-full px-4">
                <button type="submit" onClick={() =>{ updateProfile()}} className="bg-webred hover:bg-red-400 text-white px-4 py-2 rounded-lg" >{updateLoader ? "Updating..." : "Update Profile"} </button>
            </div>
            </>
          )}
        </div>
       
    </div>
      
        
        </>
  
  );
};

export default ProfileSetting;

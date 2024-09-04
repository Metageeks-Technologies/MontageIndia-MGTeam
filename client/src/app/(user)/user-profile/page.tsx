"use client";
import { useAppSelector } from "@/app/redux/hooks";
import { FaCoins } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { MdOutlineDateRange } from "react-icons/md";
import {Spinner} from "@nextui-org/react"
import { FC } from "react";
import { sendVerifyEmailLink } from "@/utils/loginOptions";
import Swal from "sweetalert2";

const Home: FC = () => {

  const router = useRouter();
  const { user }:{user:any} = useAppSelector((state) => state.user);
  console.log("user::::", user);

  const handleVerifyEmail= async ()=>{
    if(!user || !user.email){
      Swal.fire({
        icon: 'error',
        title: 'Email not found!',
        text: ' Please try again later',
      })
      return;
    }
    
    const {status,response,error}=await sendVerifyEmailLink(user.email);

    if(status==="fail"){
      Swal.fire({
        icon: 'error',
        title: {error},
        text: ' Please try again later',
      });
      return;
    }

      Swal.fire({
        icon: 'success',
        title: 'Email sent!',
        text: ' Please check your email to verify',
      });
      return;
  }

  return (
    <>
      <div className="w-full px-4 py-2 md:px-6 md:py-4 min-h-full flex flex-col rounded-lg overflow-hidden bg-white">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Profile</h2>
          <hr className="mb-4" />
          {!user && <div className="flex justify-center items-center min-h-screen"><Spinner color="danger" /></div>}
          {user && (
            <div className="flex flex-col">
            <div className="flex justify-end items-center mb-2">
            <button onClick={()=>router.push('/user-profile/settings')} className="text-md text-center md:text-start cursor-pointer px-2 py-1 md:px-8 md:py-2 bg-webred text-white rounded-lg hover:bg-webredHover-light " > Edit Profile</button>
            </div>
            <div className="w-full min-h-fit flex md:flex-row flex-col-reverse gap-4 justify-between items-center">
              <div className="md:w-3/4 w-full border border-gray-200 rounded-lg overflow-scroll md:overflow-hidden">
                <div className="flex justify-between items-center bg-gray-100 border-gray-300 px-4 py-3 border-b">
                  <div className="md:w-1/3 text-black ">
                    Name
                  </div>
                  <div className="md:w-1/3 text-black ">
                    {user.name}
                  </div>
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
                <div className="flex justify-between  items-center px-4 py-3 border-b">
                  <div className="text-black md:w-1/3 ">
                    Phone
                  </div>
                  <div className="text-black md:w-1/3">
                    +{user.phone || "Not Provided"}
                  </div>
                </div>
                <div className="flex justify-between bg-gray-100 border-gray-30 items-center px-4 py-3 border-b">
                  <div className="text-black md:w-1/3 ">
                    E-mail
                  </div>
                  {
                    !user?.emailVerified && (
                      <div className="text-blue-500 hover:underline cursor-pointer font-semibold md:w-1/3" onClick={handleVerifyEmail} >
                        Verify email
                      </div>
                    )
                  }
                  <div className="text-black md:w-1/3">
                    {user.email}
                  </div>
                </div>
                <div className="flex justify-between items-center px-4 py-3 border-b">
                  <div className="text-black md:w-1/3 ">
                    Password
                  </div>
                  <div className="text-black md:w-1/3 ">
                    ********
                  </div>
                </div>
              </div>
              <div className="md:w-1/4 bg-gray-100 h-full p-4 rounded-lg flex justify-center items-center">
                <div className="w-40 h-40  rounded-full overflow-hidden ">
                  <img
                    className="w-full h-full object-cover"
                    src={user.image}
                  ></img>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
        {user && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="text-md md:text-xl mb-4 md:mb-1 font-bold">
              Subscription plan
            </div>
            <div
              onClick={() => router.push(`/user-profile/subscription`)}
              className="text-md text-center md:text-start cursor-pointer px-2 py-1 md:px-8 md:py-2 bg-webred text-white rounded-lg hover:bg-webredHover-light"
            >
              Buy Credits
            </div>
          </div>
           
          
                {/* User Details */}
          <div className="border rounded-lg border-gray-200 mt-2">
                <div className="flex justify-between items-center px-4 py-4 border-b">
                  <div className="text-black">Plan Name</div>
                  {(user?.subscription?.PlanId) ? <div className="text-black">{user?.subscription?.PlanId?.item?.name}</div> : <div className="text-black">Free Plan </div>}
                </div>
                {
                  user.subscription?.credits && 
                  (
<div className="flex justify-between items-center px-4 py-4 border-b">
                  <div className="text-black">Credits</div>
                  <div className="text-black">
                  <div className="flex justify-center items-center gap-2"><span>{user.subscription?.credits} </span><span><FaCoins/></span></div>
                  </div>
                </div>
                  )
                }
                
                {user.subscription?.planValidity && (
                   <div className="flex justify-between items-center px-4 py-4 border-b">
                  <div className="text-black">Plan Validity</div>
                  <div className="text-black flex justify-center items-center gap-2">
                  <span>
                    {new Date(
                      user.subscription?.planValidity
                    ).toLocaleDateString('en-GB', {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }
                    )}</span>
                    <span><MdOutlineDateRange/></span>
                  </div>
                </div>
                )}
               {
                user.subscription?.status && (
                   <div className="flex justify-between items-center px-4 py-4 border-b">
                  <div className="text-black">Status</div>
                  <div className={`font-semibold capitalize ${user.subscription?.status==='active'?"text-green-500":""}`}>
                    {user.subscription?.status}
                  </div>
                </div>
                )
               }
               
          </div>
            
            
        </div>
        )}
        {/* <div className="mt-10 pb-2">
          <h1 className="text-lg font-bold mb-1">Delete my Account</h1>
          <div className="w-full flex flex-col">
            <p className="text-sm text-black">
              This will remove all of your personal data forever.
            </p>
            <p className="text-webred text-sm font-bold underline cursor-pointer">
              Delete my Account
            </p>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Home;

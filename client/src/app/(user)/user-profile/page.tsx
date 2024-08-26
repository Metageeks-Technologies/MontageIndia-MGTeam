"use client";
import { useAppSelector } from "@/app/redux/hooks";
import { useRouter } from "next/navigation";
import { FC } from "react";

const Home: FC = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);

  return (
    <>
      <div className="w-full px-4 py-2 md:px-6 md:py-4 min-h-full flex flex-col rounded-lg overflow-hidden bg-white">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Profile</h2>
          <hr className="mb-4" />
          {user && (
            <div className="w-full min-h-fit flex md:flex-row flex-col-reverse gap-4 justify-between items-center">
              <div className="md:w-3/4 w-full border border-gray-200 rounded-lg overflow-scroll md:overflow-hidden">
                <div className="flex justify-between items-center bg-gray-100 border-gray-300 px-4 py-3 border-b">
                  <div className="md:w-1/3 text-black text-xs md:text-md">
                    Name
                  </div>
                  <div className="md:w-1/3 text-black text-xs md:text-md">
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
                {/* <div className="flex justify-between items-center px-4 py-3 border-b">
                <div className="text-black w-1/3">User ID</div>
                <div className="text-black w-1/3">{user._id}</div>
                <div className="w-1/3"></div>
              </div> */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                  <div className="text-black md:w-1/3 text-xs md:text-md">
                    User Name
                  </div>
                  <div className="text-black md:w-1/3 text-xs md:text-md">
                    {user.username}
                  </div>
                  {/* <div className="w-1/3"></div> */}
                </div>
                <div className="flex justify-between bg-gray-100 border-gray-300 items-center px-4 py-3 border-b">
                  <div className="text-black md:w-1/3 text-xs md:text-md">
                    E-mail
                  </div>
                  <div className="text-black md:w-1/3 text-xs md:text-md">
                    {user.email}
                  </div>
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
                  <div className="text-black md:w-1/3 text-xs md:text-md">
                    Password
                  </div>
                  <div className="text-black md:w-1/3 text-xs md:text-md">
                    ********
                  </div>
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
                  <img
                    className="w-full h-full object-cover"
                    src={user.image}
                  ></img>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="text-md md:text-xl mb-4 md:mb-1 font-bold">
              Subscription plan
            </div>
            <div
              onClick={() => router.push(`/user-profile/subscription`)}
              className="text-md text-center md:text-start cursor-pointer px-2 py-1 md:px-8 md:py-2 bg-webred text-white rounded-lg hover:bg-[#f46379ec]"
            >
              Buy More credits
            </div>
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
                  <div className="text-black font-semibold">
                    {user.subscription?.credits}
                  </div>
                </div>
                <div className="flex justify-between items-center px-4 py-4 border-b">
                  <div className="text-black">Plan Validity</div>
                  <div className="text-black font-semibold">
                    {" "}
                    {new Date(
                      user.subscription?.planValidity
                    ).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex justify-between items-center px-4 py-4 border-b">
                  <div className="text-black">Status</div>
                  <div className="text-green ont-semibold ">
                    {user.subscription?.status}
                  </div>
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

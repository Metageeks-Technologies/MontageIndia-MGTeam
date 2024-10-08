"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/admin/sidebar";
import { FaBoxOpen, FaShippingFast } from "react-icons/fa";
import { RiGlobalLine, RiVipCrown2Line } from "react-icons/ri";
import { MdArrowOutward, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import instance from "@/utils/axios";
import OrderChart from "@/components/admin/dashboard/OrderChart";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import ProductChart from "@/components/admin/dashboard/ProductChart";

export interface SiteData {
  media: {
    totalImage: number;
    totalAudio: number;
    totalVideo: number;
  };
  totalRevenue: number;
  totalPublished: number;
  totalDeleted: number;
}

interface Activity {
  name: string;
  productId: {
    title: string;
  };
  action: string;
}

const page = () => {
  const [currentUser, setCurrentUser] = useState<any>("");
  const [recentActivities, setRecentActivities] = useState([]);
  const [revenuePeriod, setRevenuePeriod] = useState<string>("lastYear");
  const [orderPeriod, setOrderPeriod] = useState<string>("daily");
  const [siteData, setSiteData] = useState<SiteData | null>(null);

  const recentActivity = async () => {
    // setLoading( true );
    try {
      const response = await instance.get(
        `auth/admin/Activity/getAllActivity`,
        {
          params: { timeRange: "all", dataPerPage: Number.MAX_SAFE_INTEGER },
          withCredentials: true,
        }
      );
      console.log("Recent activities:", response.data.activities);
      const sortedActivities = response.data.activities.sort(
        (a: any, b: any) => {
          return b.timestamp - a.timestamp; // Sort by timestamp, most recent first
        }
      );

      // Set the top 5 recent activities after sorting
      const topFiveActivities = sortedActivities.slice(0, 5);
      console.log(topFiveActivities);
      setRecentActivities(topFiveActivities);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
    }
  };

  const getSiteData = async () => {
    try {
      const response = await instance.get("/auth/admin/siteData", {
        params: { period: revenuePeriod },
        withCredentials: true,
      });
      console.log("Site data:", response.data);
      setSiteData(response.data.siteData);
    } catch (error) {
      console.error("Error fetching site data:", error);
    }
  };

  useEffect(() => {
    getSiteData();
  }, [revenuePeriod]);

  useEffect(() => {
    recentActivity();

    // Fetching user details using Promises instead of async/await
    instance
      .get("/auth/admin/getCurrAdmin")
      .then((response) => {
        console.log("User details:", response.data);
        setCurrentUser(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, []);

  console.log("currenteuser:-", currentUser);

  return (
    <div className="container p-4 bg-pureWhite-light rounded-md">
      {/* <Sidebar /> */}

      <div className=" bg-white p-4">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Hello ! {currentUser && currentUser.name}
          </h1>

          {/* <button className="bg-webgreen text-white border border-gray-400 px-4 py-3 rounded-lg shadow flex items-center space-x-2">
            <RiGlobalLine className="h-5 w-5" />
            <span className="text-sm">Open Site</span>
          </button> */}
        </div>

        {/* Welcome to Montage India Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Welcome to Montage India 👋
          </h2>

          {/* <div className="bg-purple-50  rounded-md border border-purple-500">
            <div className=" p-4 rounded-lg flex justify-between items-center ">
              <div className="flex items-center space-x-4">
                <FaBoxOpen className="w-6 h-6 text-webgreen" />
                <div>
                  <h3 className="font-semibold">Stock your store</h3>
                  <p>Let’s get started. Tell about you and your shop</p>
                </div>
              </div>
              <button className="bg-white text-black border shadow  px-2 py-2 rounded-md flex items-center gap-2">
                Set Up
                <MdArrowOutward className="text-black h-5 w-5" />
              </button>
            </div>
            <div className=" p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <FaShippingFast className="w-6 h-6 text-webgreen" />
                <div>
                  <h3 className="font-semibold">Set your shipping</h3>
                  <p>Let’s get started. Tell about you and your shop</p>
                </div>
              </div>
              <button className="bg-white text-black px-2 border shadow py-2 rounded-md flex items-center gap-2">
                Set Up
                <MdArrowOutward className="text-black h-5 w-5" />
              </button>
            </div>
          </div> */}
        </div>

        {/* Overview Performance */}
        <div className="flex justify-between gap-6">
          <div className="mb-6 basis-[65%]">
            <div className="flex flex-col">
              {/* <div className="flex justify-between ">
                <h2 className="text-xl font-semibold mb-2">
                  Overview performance
                </h2>
                <div className="flex items-center space-x-4 mb-4">
                  <button className="bg-gray-100 px-4 py-2 rounded-md">
                    Day
                  </button>
                  <button className="bg-gray-100 px-4 py-2 rounded-md">
                    Week
                  </button>
                  <button className="bg-gray-100 px-4 py-2 rounded-md">
                    Month
                  </button>
                  <button className="bg-gray-100 px-4 py-2 rounded-md">
                    Year
                  </button>
                </div>
              </div> */}

              {/* <div className="grid grid-cols-2  border rounded-md">
                <div className="p-4 flex flex-col gap-3">
                  <h3 className="font-semibold">Total Views</h3>
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-gray-600">From last 732 (last 7 days)</p>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <h3 className="font-semibold">Visits</h3>
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-gray-600">From last 732 (last 7 days)</p>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <h3 className="font-semibold">Orders</h3>
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-gray-600">From last 124 (last 7 days)</p>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <h3 className="font-semibold">Conversion Rate</h3>
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-gray-600">From last 732 (last 7 days)</p>
                </div>
              </div> */}
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Order Trends</h1>
                <select
                  id="orderPeriod"
                  value={orderPeriod}
                  onChange={(e) => {
                    setOrderPeriod(e.target.value);
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <OrderChart period={orderPeriod} />

              <div className="mt-6">
                <RevenueChart type="userRegistrationTrends" />
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
                  Revenue{" "}
                  <select
                    id="revenuePeriod"
                    value={revenuePeriod}
                    onChange={(e) => {
                      setRevenuePeriod(e.target.value);
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
                  >
                    <option value="lastYear">Last Year</option>
                    <option value="thisYear">This Year</option>
                    <option value="thisMonth">This Month</option>
                  </select>
                </h2>
                <div className="p-5  rounded-lg flex items-center mt-6 border">
                  <div>
                    <p className="text-gray-600">Total Revenue</p>
                    <p className=" text-2xl font-semibold mt-2">
                      <div className="flex justify-start items-center gap-1">
                        <FaRupeeSign />
                        {siteData?.totalRevenue}
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 basis-[35%]">
            <div className="flex flex-col">
              <div className="mb-2 flex justify-between items-center">
                <h2 className="text-xl font-semibold ">Products </h2>
                <div className="flex gap-2 items-center">
                  <a
                    href="/admin/product/available"
                    className="text-lg cursor-pointer"
                  >
                    See All
                  </a>
                  <IoArrowForward className="h-5 w-5" />
                </div>
              </div>
              <div className="grid grid-cols-1 border rounded-md">
                <div className="p-4 flex justify-between">
                  <h3 className="font-semibold">Active listings</h3>
                  <p className="text-xl font-bold">
                    {siteData?.totalPublished}
                  </p>
                </div>
                <div className="p-4 flex  justify-between">
                  <h3 className="font-semibold">Expired</h3>
                  <p className="text-xl font-bold">{siteData?.totalDeleted}</p>
                </div>
                {/* <div className="p-4 flex justify-between">
                  <h3 className="font-semibold">Sold out</h3>
                  <p className="text-xl font-bold">0</p>
                </div> */}
              </div>
            </div>
            <div>
              {siteData && <ProductChart siteData={siteData} />}
            </div>
            <div className=" mt-6">
              <div className="flex justify-between">
                <h1 className="text-lg font-semibold">Recent Activities</h1>
                <div className="flex gap-2 items-center">
                  <a href="/admin/user/user-activity" className="text-lg">
                    See All
                  </a>
                  <IoArrowForward className="h-5 w-5" />
                </div>
              </div>
              <div className="w-full border mt-6 rounded-lg gap-2 bg-white  flex flex-col p-2 items-center justify-center">
                {(!recentActivities || recentActivities.length <= 0) && (
                  <>
                    <div className="flex items-center justify-center bg-white rounded-full p-2 shadow-md border border-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2C17.5228 2 22 6.47715 22 12C22 13.6169 21.6162 15.1442 20.9348 16.4958C20.8633 16.2175 20.7307 15.9523 20.5374 15.7206L20.4142 15.5858L19 14.1716L17.5858 15.5858L17.469 15.713C16.8069 16.4988 16.8458 17.6743 17.5858 18.4142C18.014 18.8424 18.588 19.0358 19.148 18.9946C17.3323 20.8487 14.8006 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 15C10.6199 15 9.37036 15.5592 8.46564 16.4633L8.30009 16.6368L9.24506 17.4961C10.035 17.1825 10.982 17 12 17C12.9049 17 13.7537 17.1442 14.4859 17.3965L14.7549 17.4961L15.6999 16.6368C14.7853 15.6312 13.4664 15 12 15ZM8.5 10C7.67157 10 7 10.6716 7 11.5C7 12.3284 7.67157 13 8.5 13C9.32843 13 10 12.3284 10 11.5C10 10.6716 9.32843 10 8.5 10ZM15.5 10C14.6716 10 14 10.6716 14 11.5C14 12.3284 14.6716 13 15.5 13C16.3284 13 17 12.3284 17 11.5C17 10.6716 16.3284 10 15.5 10Z"
                          fill="#3F3F46"
                        />
                      </svg>
                    </div>
                    <p className="mt-4 text-center text-gray-700">
                      You have no recent activity
                    </p>
                  </>
                )}

                {recentActivities && recentActivities.length > 0 && (
                  <>
                    <div className="px-2 mx-2 py-1 w-full flex bg-gray-100 justify-between gap-2 border rounded-md ">
                      <div className="w-1/3 capitalize font-bold ">Staff</div>
                      <div className="w-1/3 text-center font-bold">Product</div>
                      <div className="w-1/3 capitalize text-end font-bold">
                        Action
                      </div>
                    </div>

                    {recentActivities.map(
                      (activity: Activity, index: number) => (
                        <div
                          key={index}
                          className="px-2 mx-2 py-1 w-full flex  hover:bg-slate-200 justify-between gap-2 border rounded-md "
                        >
                          <div className="w-1/3 capitalize ">
                            {activity?.name}
                          </div>
                          <div className="w-1/3 text-center truncate">
                            {activity?.productId?.title}{" "}
                          </div>
                          <div
                            className={`w-1/3 capitalize text-end ${
                              activity?.action === "delete" && "text-red-400"
                            } ${
                              activity?.action === "update" && "text-[#42A5D0]"
                            } ${
                              activity?.action === "create" && "text-[#8D529C]"
                            } `}
                          >
                            {activity?.action}d
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

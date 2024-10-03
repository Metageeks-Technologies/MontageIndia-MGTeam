import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  ResponsiveContainer,
  Area,
} from "recharts";
import axios from "axios";
import instance from "@/utils/axios";

const TrendsChart = ({ type }: { type: string }) => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState<string>("daily");
  const [isRevenueTab, setIsRevenueTab] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(
          `/auth/admin/${
            isRevenueTab ? "totalRevenueTrends" : "userRegistrationTrends"
          }?period=${period}`
        );
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [isRevenueTab, period]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 justify-between">
        <div>
          <button
            className={`text-xl font-semibold mr-2 ${
              isRevenueTab ? "text-blue-500 border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setIsRevenueTab(true)}
          >
            Revenue Trends
          </button>
          <button
            className={`text-xl font-semibold  ${
              isRevenueTab ? "" : "text-blue-500 border-b-2 border-blue-500"
            }`}
            onClick={() => setIsRevenueTab(false)}
          >
            User Subscription Trends
          </button>
        </div>
        <select onChange={(e) => setPeriod(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          {!isRevenueTab ? (
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          ) : (
            <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendsChart;

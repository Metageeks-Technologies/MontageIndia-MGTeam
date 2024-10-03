// PieChartComponent.js
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SiteData } from "@/app/(admin)/admin/dashboard/page";

const PieChartComponent = ({ siteData }: { siteData: SiteData }) => {
  const [data, setData] = useState([
    { name: "Images", value: siteData.media.totalImage },
    { name: "Audio", value: siteData.media.totalAudio },
    { name: "Video", value: siteData.media.totalVideo },
  ]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={["#0088FE", "#00C49F", "#FFBB28"][index % 3]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;

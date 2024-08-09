"use client";
import instance from "@/utils/axios";
import React, { useEffect, useState } from "react";

// Interfaces for data types
interface Item {
  name: string;
  description: string;
  amount: number;
}

interface Notes {
  credits: number;
  validity: number;
}

interface SubscriptionPlan {
  _id: string;
  item: Item;
  period: string;
  notes: Notes;
  benefits: string[];
}

const SubscriptionTable: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  const fetchPlans = async (_id: any) => {
    try {
      const response = await instance.get(`payment/plan/${_id}`);
      setPlans([response.data.response]); 
      // console.log("user", response);
    } catch (error) {
      console.error("Error fetching plan by ID:", error);
    }
  };

  useEffect(() => {
   
    fetchPlans();
  }, []);

  return (
    <div className="w-full px-4 py-8">
      <h2 className="text-2xl font-semibold">User Plan</h2>
      <div className="border border-gray-200 mt-4">
        {plans.map((plan) => (
          <div key={plan._id}>
            <div className="flex justify-between items-center mx-6 py-4 border-b">
              <div className="text-gray-800 font-medium">Name</div>
              <div className="text-gray-800">{plan.item.name}</div>
              <button/>
            </div>
            <div className="flex justify-between items-center mx-6 py-4 border-b">
              <div className="text-gray-800 font-medium">Description</div>
              <div className="text-gray-800">{plan.item.description}</div>
              <button/>
            </div>
            <div className="flex justify-between items-center mx-6 py-4 border-b">
              <div className="text-gray-800 font-medium">Amount</div>
              <div className="text-gray-800">₹{plan.item.amount}</div>
              <button/>
            </div>
            <div className="flex justify-between items-center mx-6 py-4 border-b">
              <div className="text-gray-800 font-medium">Validity</div>
              <div className="text-gray-800">{plan.notes.validity} Days</div>
              <button/>
            </div>

            <div className="flex justify-between items-center mx-6 py-4 border-b">
              <div className="text-gray-800 font-medium">Credits</div>
              <div className="text-gray-800">{plan.notes.credits}</div>
              <button/>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionTable;




"use client"
import instance from '@/utils/axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Item {
  name: string;
  description: string;
  amount: number;
}

interface Notes {
  credits: number;
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
  

  const fetchPlans = async () => {
    try {
      const response = await instance.get('/user/getCurrent');
      if (response.data && response.data) {
        console.log("data", response)
        setPlans(response.data);
        
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className='w-full px-4 py-8'>
      <table className='min-w-full leading-normal'>
        <thead className='text-center'>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Description</th>
            <th className="py-2">Price</th>
            <th className="py-2">Duration</th>
            <th className="py-2">Credits</th>
            <th className="py-2">Benefits</th>
          </tr>
        </thead>
        <tbody>
          {/* {plans.map(plan => (
            <tr key={plan._id}>
              <td className="py-2">{plan.item.name}</td>
              <td className="py-2">{plan.item.description}</td>
              <td className="py-2">{plan.item.amount}</td>
              <td className="py-2">{plan.period}</td>
              <td className="py-2">{plan.notes.credits}</td>
              <td className="py-2">{plan.benefits.join(', ')}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionTable;

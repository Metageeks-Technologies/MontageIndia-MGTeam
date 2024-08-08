"use client";
import { useEffect, useState } from "react";
import { Key } from '@react-types/shared';
import SubscriptionCard from "@/components/subscription/subsciptionCard";
import {Tabs, Tab, Input, Link, Button} from "@nextui-org/react";
import instance from "@/utils/axios";

interface SubscriptionPlan {
    planId: string;
    entity: string;
    interval: number;
    period: string;
    total_count: number;
    customer_notify: boolean;
    item: {
        id: string;
        active: boolean;
        name: string;
        description: string;
        amount: number;
        unit_amount: number;
        currency: string;
        type: string;
        unit: string | null;
    };
    notes: {
        credits: number;
        validity: number;
    };
}


const SubscriptionTable=()=>{
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selected, setSelected] = useState<Key | null | undefined>("login");
  const fetchPlans = async () => {
    try {
      const response = await instance.get('/payment/fetchAllPlans');
      setPlans(response.data.response as SubscriptionPlan[]);
    } catch (error) {
        console.error('Error fetching plans:', error);
    }
    };

  useEffect(() => {
    fetchPlans();
  }, []);
    return (
        <div className="flex justify-center items-center min-h-screen text-white">
        <div className="flex flex-col justify-center items-center">
           <Tabs
            color={"danger"} 
            aria-label="Tabs price" 
            radius="lg"
            size="lg"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="Monthly" title="Monthly Plans">
              <div className="flex flex-wrap justify-center items-center gap-4">
                {plans.map((plan) => (
                  plan.period==="monthly" && <SubscriptionCard plan={plan}/>
                ))}
              </div>
     
      
            </Tab>
            <Tab key="Yearly" title="Yearly Plans">
              <div className="flex flex-wrap justify-center items-center gap-4">
                {plans.map((plan) => (
                  plan.period==="yearly" && <SubscriptionCard plan={plan}/>
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>
        </div>
    );
}

export default SubscriptionTable;
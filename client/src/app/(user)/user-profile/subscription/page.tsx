"use client";
import { useEffect, useState } from "react";
import { Key } from "@react-types/shared";
import SubscriptionCard from "@/components/subscription/subsciptionCard";
import { Tabs, Tab, Input, Link, Button, Spinner } from "@nextui-org/react";
import instance from "@/utils/axios";

interface SubscriptionPlan {
  _id: string;
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

const SubscriptionTable = () => {
  const [loader, setLoader] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selected, setSelected] = useState<Key | null | undefined>("login");
  const fetchPlans = async () => {
    try {
      setLoader(true);
      const response = await instance.get("/subscription/fetchAllPlans", {
        headers: {
          "ngrok-skip-browser-warning": true,
        },
      });
      setPlans(response.data.response as SubscriptionPlan[]);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);
  return (
    <div className="flex flex-col justify-start items-center min-h-screen rounded-lg overflow-hidden bg-white text-white">
      <div className="w-full font-bold text-xl mb-8 rounded-lg bg-[#7828c8] text-white px-6 py-4">
        Subscription Plan
      </div>
      {loader ? (
        <div className="flex justify-center items-center">
          <Spinner label="Loading..." color="danger" />
        </div>
      ) : (
        <div className="flex flex-col justify-center px-8 items-center">
          <Tabs
            color={"secondary"}
            aria-label="Tabs price"
            radius="full"
            size="lg"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="Monthly" title="Monthly Plans">
              <div className="flex flex-wrap justify-center items-center gap-4">
                {plans.map(
                  (plan) =>
                    plan.period === "monthly" && (
                      <SubscriptionCard plan={plan} />
                    )
                )}
              </div>
            </Tab>
            <Tab key="Yearly" title="Yearly Plans">
              <div className="flex flex-wrap justify-center items-center gap-4">
                {plans.map(
                  (plan) =>
                    plan.period === "yearly" && <SubscriptionCard plan={plan} />
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTable;

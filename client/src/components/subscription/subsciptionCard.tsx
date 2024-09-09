import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadScript } from "../../utils/loadScript";
import instance from "@/utils/axios";
import { ScrollShadow } from "@nextui-org/react";
import { FaRupeeSign } from "react-icons/fa";
import Swal from "sweetalert2";
import { ThreeDotsLoader } from "@/components/loader/loaders";
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
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Props {
  plan: SubscriptionPlan;
}

const SubscriptionCard: React.FC<Props> = ({ plan }) => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [subsLoader, setSubsLoader] = useState(false);

  const handlePaymentSuccess =async () => {
    // console.log("payment success");
    Swal.fire({
      title: "Subscription purchased successfully",
      text: "Plan will be activated soon",
      color: "green",
      icon: "success",
      timer: 5000,
      confirmButtonColor: "#2300a3",
      
    });
    router.push("/user-profile");
    return;
  };
  const handlePayment = (options: any) => {

    try{
      console.log("payment called", options);
      if (!loaded || typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK not loaded. Please try again later.");
        setSubsLoader(false);
        return;
      }
      const razorpayObject = new window.Razorpay(options);
      razorpayObject.on("payment.failed", (response: any) => {
        console.log("payment failed", response);
        alert("This step of Payment Failed");
        setSubsLoader(false);
      });
      razorpayObject.open();

      setSubsLoader(false);
    }
    catch(err){
      console.error("Error in creating subscription", err);
      setSubsLoader(false);
      return;
    }
    
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js")
      .then(() => setLoaded(true))
      .catch((err) => console.error("Failed to load Razorpay script", err));
  }, []);

  const handleSubsription = async () => {

    const subsciptionOption = {
      plan_id: plan.planId,
      total_count: plan.total_count,
      customer_notify: plan.customer_notify ? 1 : 0,
      notes: {
        credits: plan.notes.credits,
        subscriptionId: plan._id,
      },
    };
    // console.log("subsciptionOption", subsciptionOption);
    setSubsLoader(true);

    try{
      const response: any = await instance.post(
      "/subscription/create",
      subsciptionOption, // This is the request body
      {
        headers: {
          "ngrok-skip-browser-warning": true,
        },
        withCredentials: true,
      }
    );
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY as string,
      name: "MontageIndia",
      description: "Pay & Checkout this product",
      image:
        "https://cdn.dribbble.com/users/111709/screenshots/3969111/media/8b3190c331faa522644c6b6a5432ccf1.jpg",
      subscription_id: response.data.subcriptionId,
      handler: (res: any) => {
        handlePaymentSuccess();
      },
      theme: {
        color: "#2300a3",
      },
    };
      handlePayment(options);

    }
    catch(err){
      console.error("Error in creating subscription", err);
      setSubsLoader(false);
      return;
    } 
  };

  // console.log(plan);
  return (
    <div className="flex-1 text-xl rounded-xl text-black border border-[#E3B4EF]/25 bg-[#FDF8FF] p-10">
      <div className="text-center md:h-[10vh] font-semibold mb-2 md:mb-4">
        {plan.item.name}
      </div>
      <div className="flex justify-center items-center  mb-4 text-center text-[#7828c8]">
        <span className="md:text-3xl font-bold mr-2">
          <FaRupeeSign />
        </span>
        <span className="font-bold md:text-3xl"> {plan.item.amount / 100}</span>
      </div>
      <ScrollShadow
        hideScrollBar
        size={0}
        className="md:h-[20vh] text-sm md:text-md text-center mb-4"
      >
        {plan.item.description}
      </ScrollShadow>

      <div className="text-lg text-center font-bold mb-4">
        Credits: {plan.notes.credits}
      </div>
      <button
        onClick={handleSubsription}
        className="my-2 w-full text-white px-6 py-2 rounded-lg bg-webred text-lg hover:bg-[#f63c3c] transition-all"
      >
        {subsLoader ? <ThreeDotsLoader /> : "Subscribe"}
      </button>
    </div>
  );
};

export default SubscriptionCard;

"use client";
import React, { useState, useEffect } from "react";
import { loadScript } from "../../utils/loadScript";
import instance from "@/utils/axios";
import { OrderOption } from "@/types/order";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux/hooks";
import { setCart } from "@/app/redux/feature/product/slice";
import { Spinner } from "@nextui-org/react";
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface props {
  orderOption: OrderOption;
}

const PayButton: React.FC<props> = ({ orderOption }) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handlePaymentSuccess = async (res: any) => {
    try {
      const response: any = await instance.post("/payment/verify", res);
      console.log("step 2:", response);
      if (response.data.success) {
        dispatch(setCart([]));
        // alert(response.data.message);

        router.push("/user-profile/purchased-product");
      } else {
        alert("payment failed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePayment = (options: any) => {
    if (!loaded || typeof window.Razorpay === "undefined") {
      alert("Razorpay SDK not loaded. Please try again later.");
      return;
    }
    const razorpayObject = new window.Razorpay(options);
    razorpayObject.on("payment.failed", (response: any) => {
      console.log("payment failed", response);
      alert("This step of Payment Failed");
    });
    razorpayObject.open();
  };

  //this function creates a order in razorpay and store order information in Montage India database
  const handleOrderPlace = async () => {
    console.log(orderOption);
    const response: any = await instance.post("/order/", orderOption, {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    });

    console.log("step 1:", response);

    if (!response.data.success) {
      alert("Something went wrong. Please try again later");
      setLoading(false);
      return;
    }
    const paymentOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY as string,
      name: "MontageIndia",
      amount: orderOption.amount,
      currency: "INR",
      description: "Pay & Checkout this product",
      image:
        "https://cdn.dribbble.com/users/111709/screenshots/3969111/media/8b3190c331faa522644c6b6a5432ccf1.jpg",
      order_id: response.data.order_id,
      handler: (res: any) => {
        console.log("step3:", res);
        res.order_id = response.data.order_id;
        handlePaymentSuccess(res);
      },
      theme: {
        color: "#2300a3",
      },
    };

    handlePayment(paymentOptions);
  };
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js")
      .then(() => setLoaded(true))
      .catch((err) => console.error("Failed to load Razorpay script", err));
  }, []);

  return (
    <button
      onClick={handleOrderPlace}
      className="text-white px-4 py-2 rounded-md bg-webgreen text-md max-sm:text-lg hover:bg-webgreen-light transition-all whitespace-nowrap"
    >
      Place Order
    </button>
  );
};

export default PayButton;

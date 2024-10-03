"use client";
import React, { useState, useEffect } from "react";
import { loadScript } from "../../utils/loadScript";
import instance from "@/utils/axios";
import { OrderOption } from "@/types/order";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { ThreeDotsLoader } from "@/components/loader/loaders";
import Swal from "sweetalert2";
import { redirectToLogin } from "@/utils/redirectToLogin";
import { setCart } from "@/app/redux/feature/product/slice";
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
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.user);

  const handlePaymentSuccess = async (res: any) => {
    dispatch(setCart([]));
    router.push("/user-profile/purchased-product");
    Swal.fire({
      title: "Order Placed",
      text: "Your order has been placed successfully",
      icon: "success",
      color: "green",
      timer: 3000,
      confirmButtonColor: "#2300a3",
    });
  };
  const handlePayment = (options: any) => {
    if (!loaded || typeof window.Razorpay === "undefined") {
      alert("Razorpay SDK not loaded. Please try again later.");
      setLoading(false);
      return;
    }
    const razorpayObject = new window.Razorpay(options);
    razorpayObject.on("payment.failed", (response: any) => {
      console.log("payment failed", response);
      alert("This step of Payment Failed");
    });
    razorpayObject.open();
    setLoading(false);
  };

  //this function creates a order in razorpay and store order information in Montage India database
  const handleOrderPlace = async () => {
    console.log(orderOption);
    if (!user) {
      redirectToLogin(router, pathname);
      return null;
    }
    try {
      setLoading(true);
      const response: any = await instance.post("/order/", orderOption, {
        headers: {
          "ngrok-skip-browser-warning": true,
        },
      });

      console.log("step 1:", response);

      if (!response.data.success) {
        setLoading(false);
        alert("Something went wrong. Please try again later");
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
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
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
      {loading ? <ThreeDotsLoader /> : "Place Order"}
    </button>
  );
};

export default PayButton;

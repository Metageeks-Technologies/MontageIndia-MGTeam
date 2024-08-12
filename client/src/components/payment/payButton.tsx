"use client";
import React,{useState,useEffect} from 'react';
import { loadScript } from '../../utils/loadScript';
import instance from '@/utils/axios';
import {OrderOption} from '@/types/order';

declare global {
  interface Window {
    Razorpay: any; 
  }
}

interface props{
  orderOption:OrderOption;
}

const PayButton: React.FC<props> = ({orderOption}) => {
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
  
    const handlePaymentSuccess= async(res:any) => {
      const response:any= await instance.post('/payment/capture',res,{
          withCredentials: true
      });
      console.log("step2:",response);
      
        alert(response.data.message);
    }
    const handlePayment = (options: any) => {
    
      if (!loaded || typeof window.Razorpay === 'undefined') {
        alert('Razorpay SDK not loaded. Please try again later.');
        return;
      }
      const razorpayObject = new window.Razorpay(options);
      razorpayObject.on('payment.failed', (response: any) => {
        console.log("payment failed",response);
        alert('This step of Payment Failed');
      });
      razorpayObject.open();
    };

  //this function creates a order in razorpay and store order information in Montage India database
  const handleOrderPlace= async() => {
    const response:any= await instance.post('/payment/order',orderOption,{
        withCredentials: true
    });

    console.log("step 1:",response)

    if(!response.data.success){
      alert("Something went wrong. Please try again later");
      return;
    }

    const paymentOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, 
        amount: orderOption.amount, 
        currency: orderOption.currency,
        name: "montageIndia",
        description: "Complete your purchase securely with Montage India’s trusted payment gateway. Choose from multiple payment options and gain instant access to premium images, videos, and audio content. Enjoy a seamless checkout experience with 24/7 customer support.",
        image: "https://cdn.dribbble.com/users/111709/screenshots/3969111/media/8b3190c331faa522644c6b6a5432ccf1.jpg",
        order_id: response.data.rp_order_id,  
        handler: function (res: any) {
            console.log("step3:",res);
            res.rp_order_id=response.data.rp_order_id;
            res.mi_order_id=response.data.mi_order_id;
            handlePaymentSuccess(res);
       },
       prefill: {
          //Here we are prefilling random contact
         contact:"7011420877", 
           //name and email id, so while checkout
         name: "shivam",  
         email: "shivamsisodia8656816@gmail.com"
       },
      notes: {
         Db_order_id: response.data.mi_order_id,
       }, 
       theme: {
           color: "#2300a3"
       }
   };

   handlePayment(paymentOptions);

  }


  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js')
      .then(() => setLoaded(true))
      .catch((err) => console.error('Failed to load Razorpay script', err));
  }, []);

    return (
        <button onClick={handleOrderPlace} className="text-white px-4 py-2 rounded-3xl bg-webgreen text-md max-sm:text-lg hover:bg-webgreen-light transition-all">
            Place Order
        </button>
       
    );
};

export default PayButton;

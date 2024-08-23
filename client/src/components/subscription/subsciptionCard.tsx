import React,{useState,useEffect} from 'react';
import { loadScript } from '../../utils/loadScript';
import instance from '@/utils/axios';
import {ScrollShadow} from '@nextui-org/react'
import { FaRupeeSign } from "react-icons/fa";
import { useRouter } from 'next/navigation';
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
declare global {
  interface Window {
    Razorpay: any; 
  }
}

interface Props {
    plan: SubscriptionPlan;
}

const SubscriptionCard: React.FC<Props> = ({ plan }) => {
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const router = useRouter();
    const handlePaymentSuccess= async(res:any) => {
      router.push('/user-profile')
    }
  const handlePayment = (options: any) => {
    console.log("payment called",options);
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

  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js')
      .then(() => setLoaded(true))
      .catch((err) => console.error('Failed to load Razorpay script', err));
  }, []);
  
    const handleSubsription = async() => {
      console.log("subscription clicked",plan);

      const subsciptionOption={
          plan_id:plan.planId,
          total_count:plan.total_count,
          customer_notify:plan.customer_notify?1:0,
          notes:{
            credits:plan.notes.credits,
          }
      }
      console.log("subsciptionOption",subsciptionOption);
    const response: any = await instance.post(
      '/subscription/create',
      subsciptionOption, // This is the request body
      {
        headers: {
          'ngrok-skip-browser-warning': true,
        },
        withCredentials: true,
      }
    );

     console.log("subscription response",response);

     const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY as string,
      name: 'MontageIndia',
      description: 'Pay & Checkout this product',
      image: 'https://cdn.dribbble.com/users/111709/screenshots/3969111/media/8b3190c331faa522644c6b6a5432ccf1.jpg',
      subscription_id: response.data.subcriptionId,
      handler: (res: any) => {
        res.subscriptionCreationId = response.data.subcriptionId;
        handlePaymentSuccess(res);
      },
      theme: {
        color: '#2300a3',
      },
    };

    console.log("options",options);

    handlePayment(options);

    }

    console.log(plan);
    return (
        <div className="flex-1 text-xl rounded-xl text-black border border-[#E3B4EF]/25 bg-[#FDF8FF] p-10">
            <div className="text-center h-[10vh] font-semibold mb-4">{plan.item.name}</div>
            <div className="flex justify-center items-center  mb-4 text-center text-[#7828c8]">
              <span className="text-3xl font-bold mr-2"><FaRupeeSign/></span><span className='font-bold text-3xl'> {plan.item.amount / 100} {plan.item.currency}</span> 
            </div>
             <ScrollShadow hideScrollBar size={0} className="h-[20vh] text-center mb-4">
        {plan.item.description}
        </ScrollShadow>
             
            <div className="text-lg text-center font-bold mb-4">
                Credits: {plan.notes.credits}
            </div>
             <button onClick={handleSubsription}
                className="my-2 w-full text-white px-6 py-2 rounded-lg bg-webred text-lg hover:bg-[#f63c3c] transition-all"
              >
                Subscribe
            </button>
        </div>
    );
};

export default SubscriptionCard;

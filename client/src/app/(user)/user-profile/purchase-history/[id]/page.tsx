'use client';  
import { useEffect,useState } from 'react';
import {useParams} from 'next/navigation';
import instance from '@/utils/axios';
import ProductCard from '@/components/product/productCard';
import {Spinner} from "@nextui-org/react";
import {SpinnerLoader} from '@/components/loader/loaders';
const OrderPage = () => {
    const params = useParams();
    const id  = params.id as string;
    const [order, setOrder] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const fetchOrder = async () => {
        if(!id) return;
        setLoading(true);
        try{
            const response:any = await instance.get(`/order/${id}`);
            setOrder(response.data.order);
            console.log("data", response);
            setLoading(false);
        }
        catch(error){
            console.error("Error fetching order by user ID:", error);
            setLoading(false);
        }

    }

    useEffect(() => {
      fetchOrder();
    }, [id]);

  return (
    <div className='w-full rounded-lg overflow-hidden min-h-screen bg-white px-6 py-4'>
      <h1 className="text-xl font-semibold mb-6 text-gray-800">Order ID # {id}</h1>
      <hr className='mb-6' />

      <div className="flex flex-col gap-4 overflow-y-scroll">

      {loading ? (
        <SpinnerLoader />
      ) : (
        order && order?.products?.length > 0  && order?.products?.map((product: any, index: number) => (
          <ProductCard key={index} product={product.productId} />
        ))
      )}
      </div>
    </div>
  );
};

export default OrderPage;

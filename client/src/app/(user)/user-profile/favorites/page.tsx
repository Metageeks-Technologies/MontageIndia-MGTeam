'use client';  
import { useEffect,useState } from 'react';
import instance from '@/utils/axios';
import ProductCard from '@/components/product/productCard';
import {Spinner} from "@nextui-org/react";
import type { TProduct } from '@/types/product';



const WishListPage = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any>([]);

    const fetchWishList = async () => {
        setLoading(true);
        try{
            const response:any = await instance.get(`/user/wishlist`);
            setProducts(response.data.products);
            console.log("data", response);
            setLoading(false);
        }
        catch(error){
            console.error("Error fetching order by user ID:", error);
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchWishList();
    }, []);

  return (
    <div className='w-full min-h-screen rounded-lg overflow-hidden bg-white px-6 py-4'>
      <h1 className="text-xl font-semibold mb-6 text-gray-800">Faviorates</h1>
      <hr className='mb-6' />
      <div className="flex flex-col gap-4 overflow-y-scroll">
        {loading && (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner color='danger' size='lg' />
            </div>
        )}
        {
          !loading && products && products.length>0 && products.map((product : any) => (
                <ProductCard key={product._id} product={product.productId} status="wishlist" />
            ))
        }
      </div>
    </div>
  );
};

export default WishListPage;

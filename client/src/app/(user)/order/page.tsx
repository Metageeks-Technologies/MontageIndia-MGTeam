"use client"
import React, { useEffect, useState } from 'react'
import { addCartItem, getCartData, getCurrCustomer, removeCartItem } from '@/app/redux/feature/user/api';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {OrderOption} from '@/types/order';
import PayButton from "@/components/payment/payButton";
import { MdDeleteForever,MdCurrencyRupee } from 'react-icons/md';
import instance from '@/utils/axios';
import { notifyError, notifySuccess } from '@/utils/toast';

const PlaceOrder = () => {
    const dispatch = useAppDispatch();
    const [amount, setAmount] = useState(0);
    const cartProduct = useAppSelector((state) => state.user.cartData);
    const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
 
 
    const handleBuyWithCredits = async (id: string) => {
      
        try{
            const response = await instance.post(`/product/buyWithCredits/${id}`, { withCredentials: true });
            console.log(response);
            if(response.data.success){
                notifySuccess(response.data.message);
                // handleRemoveCart(id);
            }
        }
        catch(error:any){
            console.error(error);
            notifyError(error.response.data.message || "Something went wrong. Please try again later");
        }
    }

    const handleRemoveCart = (id: string,variantId:string) => {
        removeCartItem(dispatch, id,variantId);
    }
    
    const calculateTotalPrice = () => {
        const total = cartProduct.reduce((total: number, item: any) => {
            const matchingVariant = item.product?.variants?.find((variant: any) =>
                item.variantId.includes(variant._id)
            );
            const price = matchingVariant ? matchingVariant.price : 0;
            return total + price;
        }, 0);
    
        return total; // Return total as a number
    };
    

    useEffect(() => {
        setAmount(calculateTotalPrice());
    }, [cartProduct]);
    
    useEffect(() => {
        getCartData(dispatch);
    }, [dispatch]);

    const createOrderOption = (): OrderOption => {
        const products = cartProduct.map((item: any) => ({
            productId: item.product._id,
            variantId: item.variantId[0] // Assuming the first variant ID is needed
        }));

        return {
            
            amount: amount.toString().concat("00"), // Convert the amount to a string
            currency: "INR",
            notes: {
                products
            }
        };
    };
    const handleSizeChange = (productId: string, variantId: string) => {
        setSelectedSizes(prevSizes => ({
            ...prevSizes,
            [productId]: variantId
        }));
        console.log(`Selected size for product ${productId}: ${variantId}`);
        addCartItem(dispatch,productId,variantId)
    };

    const orderOption = createOrderOption();

    return (
        <div className='w-[90%] flex justify-center flex-col m-auto py-6'>
        <div className='mb-4'>
            {cartProduct?.map((item:any, index:number) => (
                <div key={index} className="flex justify-around w-full items-center py-4 px-2 hover:bg-gray-100 cursor-pointer ">
                        <div className='flex justify-start gap-4 flex-wrap w-2/3'>
                            <div className='w-80 h-40'>
                                <img 
                                    src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${item?.product.thumbnailKey}`}
                                    alt="Item" className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className='flex flex-col justify-between items-start py-2'>
                            <div className='flex flex-col justify-start items-start '>
                                <div className='text-xl font-bold'> {item?.product.title?.toUpperCase()}</div>
                                <div className='text-lg text-gray-600 mb-2 truncate'>{item?.product.description}</div>
                                <div className='text-lg text-gray-600 mb-2 truncate'>
                                <select
                                    className='text-gray-700 outline-none font-semibold py-3 select-none p-2 bg-gray-100 rounded-lg'
                                    value={selectedSizes[item.product._id] || item.variantId[0]}
                                    onChange={(e) => handleSizeChange(item.product._id, e.target.value)}
                                >
                                    {item.product.variants.map((variant: any) => (
                                        <option key={variant._id} value={variant._id}>
                                            {variant.size}
                                        </option>
                                    ))}
                                </select>
                                {
                                    item.product?.variants.find((variant: any) => 
                                        item.variantId.includes(variant._id)
                                    )?.size
                                }    
                                </div>
                          </div>
                          <div> 
                          {item?.product.tags && item?.product.tags?.length > 0 &&
                          item?.product.tags?.map((tag: string) => (
                              <span className='text-white rounded-full mr-2 px-4 py-1 bg-webgreen '>{tag}</span>
                          ))}
                          </div>
                          </div>
                        </div>
                    <div className='flex items-center justify-start gap-1'>
                        <div className="text-gray-600 items-center text-center flex flex-row">
                        <span className='font-bold'><MdCurrencyRupee/></span>

                        {
                            item.product?.variants.find((variant: any) => 
                                item.variantId.includes(variant._id)
                            )?.price
                        }    
                       </div>
                    </div>
                    <div className="flex items-center gap-4 jutify-center">   
                        <span onClick={() => handleBuyWithCredits(item?.product._id)} className='bg-var1-light text-white rounded-full px-4 py-1'>Buy with credits</span>
                        <span className="text-red-500 cursor-pointer" onClick={()=>{handleRemoveCart(item.product?._id,item.variantId[0])}} >

                            <MdDeleteForever size={25} />
                        </span>
                    </div>
                </div>
            ))}
            </div>

            <div className='flex justify-end items-center gap-4 px-4 '>
            <div className='flex justify-center items-center gap-2 '>
                <span className='font-semibold'>Total Price: </span>
                <span className='font-bold'><MdCurrencyRupee/></span>
                <span>{amount}</span>
            </div>
                
                 <PayButton orderOption={orderOption}/>
            </div>
        </div>
    )
}

export default PlaceOrder;

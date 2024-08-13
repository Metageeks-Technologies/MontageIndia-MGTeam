"use client"
import React, { useEffect, useState } from 'react'
import { getCartData, getCurrCustomer, removeCartItem } from '@/app/redux/feature/user/api';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {OrderOption} from '@/types/order';
import PayButton from "@/components/payment/payButton";
import { MdDeleteForever,MdCurrencyRupee } from 'react-icons/md';
import instance from '@/utils/axios';
import { notifyError, notifySuccess } from '@/utils/toast';

const PlaceOrder = () => {
    const dispatch = useAppDispatch();

    // const OrderOption:OrderOption={
    //   amount:"59900",
    //   currency:"INR",
    //   notes:{
    //    products:[
    //        {
    //         product: "66b60e93be93bd1343a014d2",
    //         variantId: "66b60f49be93bd1343a014d9",
    //        },{
    //         product: "66b60d23be93bd1343a01421",
    //         variantId: "66b60d2dbe93bd1343a01427",
    //        }
    //    ]
    //   },
    // }

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

    const cartProduct = useAppSelector((state) => state.user.cartData);
    console.log("cartProduct:", cartProduct)

    useEffect( () =>
      {
        getCartData(dispatch);
      }, [] );

      const calculateTotalPrice = () => {
        return cartProduct.reduce((total, item) => {
            const matchingVariant = item.product?.variants?.find((variant: any) =>
                item.variantId.includes(variant._id)
            );
            const price = matchingVariant ? matchingVariant.price : 0;
            return total + price;
        }, 0);
    }

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
                                <div className='text-xl font-bold'>  {item?.product.title?.toUpperCase()}</div>
                                <div className='text-lg text-gray-600 mb-2 truncate'>{item?.product.description}</div>
                                <div className='text-lg text-gray-600 mb-2 truncate'>
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
                <span>{calculateTotalPrice()}</span>
                <span className='font-bold'><MdCurrencyRupee/></span>
            </div>
                
                 {/* <PayButton orderOption={OrderOption}/> */}
            </div>
        </div>
    )
}

export default PlaceOrder;

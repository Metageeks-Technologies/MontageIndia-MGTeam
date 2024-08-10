"use client"
import { getCartData, getCurrCustomer, removeCartItem } from '@/app/redux/feature/user/api';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { TCustomer } from '@/types/customer';
import instance from '@/utils/axios';
import React, { useEffect, useState } from 'react'
import { MdDeleteForever } from 'react-icons/md';

const PlaceOrder = () => {
    const dispatch = useAppDispatch();

    const handleRemoveCart = (id: string) => {
        removeCartItem(dispatch, id);
    }

    const cartProduct = useAppSelector((state) => state.user.cartData);

    useEffect( () =>
      {
        getCartData(dispatch)
      }, [] );

    const calculateTotalPrice = () => {
        return cartProduct.reduce((total, item) => {
            const price = item.variants && item.variants.length > 0 ? item.variants[0].price : 0;
            return total + price;
        }, 0);
    }

    return (
        <div className='max-w-5xl flex justify-center flex-col m-auto w-full'>
            {cartProduct?.map((item:any, index:number) => (
                <div key={index} className="flex justify-around w-full items-center py-4 px-6 border-b">
                    <div className="flex gap-4 w-1/2 items-center">
                        <div className='flex flex-col'>
                            <div>
                                <img 
                                    src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${item.thumbnailKey}`}
                                    alt="Item" className="w-26 h-20 object-cover mr-4" 
                                />
                            </div>
                            <div className='flex justify-start'>{item.title.toUpperCase()}</div>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span>
                            {item.category.map((cat: string) => 
                                cat.charAt(0).toUpperCase() + cat.slice(1)
                            ).join(', ')}
                        </span>  
                        <span>{item.mediaType.charAt(0).toUpperCase() + item.mediaType.slice(1)}</span>
                        <span>{item.tags.join(', ')}</span>
                    </div>
                    <div className="flex items-center flex-col right-0">
                        <span className="mr-4">
                            Price: {item.variants && item.variants.length > 0 ? item.variants[0].price : 'No price available'}
                        </span>
                        <span className="text-red-500 cursor-pointer" onClick={() => handleRemoveCart(item._id)}>
                            <MdDeleteForever size={25} />
                        </span>
                    </div>
                </div>
            ))}
            <div>
                <span className='font-semibold'>Total Price: </span>
                <span>{calculateTotalPrice()}</span>
            </div>
        </div>
    )
}

export default PlaceOrder;

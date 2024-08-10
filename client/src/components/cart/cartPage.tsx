'use client'
import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch,useAppSelector } from "@/app/redux/hooks";
import { AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { Button } from "@nextui-org/react";
import { removeCartItem } from "@/app/redux/feature/user/api";
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";

function CartPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch=useAppDispatch()
  const cartProduct = useAppSelector((state) => state.user.cartData);
  const handleRemoveCart=(id:string)=>{
    removeCartItem(dispatch,id)
  }
  useEffect(() => {
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      
      {!isOpen?
      <AiOutlineShoppingCart 
        className="text-gray-700 w-6 h-6 cursor-pointer" 
        onClick={() => setIsOpen(true)}
      />: (
        <div className="fixed w-full h-full left-0 top-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl my-3 justify-self-end w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <AiOutlineClose 
                className="text-gray-700 w-6 h-6 cursor-pointer" 
                onClick={() => setIsOpen(false)}
              />
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Cart items */}
              {cartProduct.flat().map((item:any,index:number) => (
                <div key={index} className="flex justify-between items-center py-4 px-6 border-b">
                  <div className="flex items-center">
                    <img 
                    src={ `https://mi2-public.s3.ap-southeast-1.amazonaws.com/${ item.thumbnailKey}`}
                    alt="Item" className="w-16 h-12 object-cover mr-4" />
                    <span>{item.title}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4">
                    {item.variants && item.variants.length > 0 ? item.variants[0].price : 'No price available'}
                    </span>
                    <span className="text-red-500 cursor-pointer" onClick={()=>{handleRemoveCart(item._id)}} >
                    <MdDeleteForever size={25} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center items-center">
              <Link href="/order" className="p-3 py-2 font-semibold rounded-lg bg-blue-400" >Place your Order</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartPopup;
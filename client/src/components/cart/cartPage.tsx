'use client'
import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch,useAppSelector } from "@/app/redux/hooks";
import { fetchCart } from "@/app/redux/reducer/cartSlice";
import { AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { Button } from "@nextui-org/react";
import { getCurrAdmin } from "@/app/redux/feature/user/api";

function CartPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const productIds = ["66ac95b11526869ca548fa31", "66acd04b88a01a94656d7ade", "66acd27488a01a94656d7beb"];
  // const products = useSelector((state) => state.cart);
  const products = useAppSelector((state) => state.cart);
  // const dispatch = useDispatch();
  const dispatch = useAppDispatch();

  useEffect(() => {
    getCurrAdmin(dispatch, "66ac95b11526869ca548fa31");
  }, []);

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
      <AiOutlineShoppingCart 
        className="text-gray-700 w-6 h-6 cursor-pointer" 
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl mt-20 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <AiOutlineClose 
                className="text-gray-700 w-6 h-6 cursor-pointer" 
                onClick={() => setIsOpen(false)}
              />
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Cart items */}
              {[1, 2, 3, 4, 5,6,7,8,9,10].map((item) => (
                <div key={item} className="flex justify-between items-center py-4 border-b">
                  <div className="flex items-center">
                    <img src="path_to_image" alt="Item" className="w-16 h-12 object-cover mr-4" />
                    <span>MOV</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4">$79</span>
                    <Button size="sm">Remove</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <span className="text-xl font-bold">Total: $395</span>
              <Button color="primary">Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartPopup;
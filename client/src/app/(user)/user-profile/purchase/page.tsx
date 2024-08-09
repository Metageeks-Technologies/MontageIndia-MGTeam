"use client";
import instance from "@/utils/axios";
import React, { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  amount: number;
  mediaType: string;
}

interface Order {
  _id: string;
  items: Product[];
  status: string;
  totalAmount: number;
  createdAt: string;
  paymentDetails: {
    paymentMethod: string;
    paymentId: string;
    paymentDate: string;
  };
}

const ProductList: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);

  const fetchOrder = async (_id: string) => {
    try {
      const response = await instance.get(`orders/${_id}`);
      setOrder(response.data.response); 
      console.log("Order data:", response.data.response);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
    }
  };

  useEffect(() => {
    
    fetchOrder();
  }, []);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-2xl font-medium">Purchase History</h1>
      <div className="space-y-4 py-4">
        {order.items.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-lg font-semibold">{product.name}</p>
                  <p className="text-gray-500">MediaType: {product.mediaType}</p>
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold">${product.amount}</p>
              </div>
              <div className="mt-2 justify-between items-center">
                <p className="text-sm font-semibold text-green-600">
                  {order.status} on
                </p>
                <p className="text-sm font-semibold text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

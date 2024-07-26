"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { product } from "../../../../db";

export interface Variant {
  label: string;
  price: number;
  key: string;
}

export interface Product {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  variants: Variant[];
  status: string;
  mediaType: string;
  publicKey: string;
  thumbnailKey: string;
}

const ProductDetail: React.FC = () => {
  const params = useParams();
  const [productDetail, setProductDetail] = useState<any>(null);

  const id = params.id as string | undefined;

  useEffect(() => {
    if (id) {
      const foundProduct = product.find((prod: any) => prod.id === id);
      setProductDetail(foundProduct);
    }
  }, [id]);

  if (!productDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center">Edit Route Page</h1>
      <div className=" mt-2 max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          className="w-full h-64 object-cover"
          src={productDetail.thumbnailKey}
          alt={productDetail.title}
        />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{productDetail.title}</h1>
          </div>
          <p className="text-gray-700 mb-4">{productDetail.description}</p>
          <p
            className={`text-sm font-semibold mb-4 ${
              productDetail.status === "available"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {productDetail.status}
          </p>
          <div className="flex flex-wrap mb-4">
            {productDetail.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold mb-2">Variants</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {productDetail.variants.map((variant: Variant, index: number) => (
                <div
                  key={index}
                  className="flex flex-col items-center border rounded-lg p-2 bg-gray-50"
                >
                  <img
                    className="w-12 h-12 rounded-full mb-2"
                    src={variant.key}
                    alt={variant.label}
                  />
                  <div className="text-center">
                    <p className="text-sm font-semibold">{variant.label}</p>
                    <p className="text-xs text-gray-600">
                      ${variant.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

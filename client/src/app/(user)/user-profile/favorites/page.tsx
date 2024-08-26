"use client";
import { useEffect, useState } from "react";
import instance from "@/utils/axios";
import ProductCard from "@/components/product/productCard";
import { Spinner } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getWishlist } from "@/app/redux/feature/product/api";

const WishListPage = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((state) => state.product);
  // console.log(wishlist);

  const fetchWishList = async () => {
    setLoading(true);
    await getWishlist(dispatch);
    setLoading(false);
  };

  useEffect(() => {
    fetchWishList();
  }, []);

  return (
    <div className="w-full min-h-screen rounded-lg overflow-hidden bg-white px-4 py-2 md:px-6 md:py-4">
      <h1 className="text-xl font-semibold md:mb-6 text-gray-800">
        Faviorates
      </h1>
      <hr className="mb-6" />
      <div className="flex flex-col gap-4 overflow-y-scroll">
        {loading && (
          <div className="flex justify-center items-center min-h-screen">
            <Spinner color="danger" size="lg" />
          </div>
        )}
        {!loading &&
          wishlist &&
          wishlist.length > 0 &&
          wishlist.map((product: any) => (
            <ProductCard
              key={product._id}
              product={product}
              status="wishlist"
            />
          ))}
      </div>
    </div>
  );
};

export default WishListPage;

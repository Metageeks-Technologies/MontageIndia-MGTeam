import { TProduct } from "@/types/product";
import { IoMdDownload } from "react-icons/io";
import { SiGoogledocs } from "react-icons/si";
import { FaRupeeSign } from "react-icons/fa";
import { formatDateTime } from "@/utils/DateFormat";
import { IoEyeOutline } from "react-icons/io5";
import { CiShoppingCart } from "react-icons/ci";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  uuid: string;
  description: string;
  price: number;
  thumbnailKey: string;
  mediaType: "image" | "video" | "audio";
  variants: any;
  createdAt: string;
}

interface ProductCardProps {
  product: any;
  status?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, status }) => {
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  console.log("product", product, status);

  return (
    <div className="w-full flex md:flex-row flex-col justify-start bg-white gap-4 items-start border-b rounded-lg md:p-4 ">
      <div className="md:w-1/3 md:h-[40vh] overflow-hidden">
        <img
          className="w-full h-full rounded-lg object-cover"
          src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}${product.thumbnailKey}`}
          alt={product.title}
        />
      </div>
      <div className="md:w-2/3 md:h-[40vh] flex flex-col justify-between items-start">
        <div className="mb-2">
          <div className="md:text-2xl capitalize font-bold">{product.title}</div>
          <div className=" text-left">
            <span className="text-gray-500 font-semibold">ProductId : </span>
            <span className="text-sm">{product.uuid}</span>
          </div>
        </div>
        <div className="text-left">
          <span className="text-gray-500 font-semibold">Description : </span>
          <span className="text-sm">{product.description}</span>{" "}
        </div>
        <div className="text-left  flex justify-start items-center ">
          <span className="text-gray-500 font-semibold">Price : </span>{" "}
          <span>
            <FaRupeeSign />
          </span>
          <span className="text-sm"> {product.variants[0].price}</span>
        </div>
        <div className="text-left ">
          <span className="text-gray-500 font-semibold">Date : </span>
          <span className="text-sm">{formatDateTime(product.createdAt)}</span>
        </div>
        <div className="text-left mb-4">
          <span className="text-gray-500 font-semibold">Sizes : </span>
          <span className="text-sm">{product.variants[0].size}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
          <button className="w-full px-4 py-2 rounded-lg  hover:bg-[#ef3a3abe] text-white bg-webred">
            <Link
              href={`/${product.mediaType}/${product.uuid}`}
              className="w-full flex gap-2 justify-center  items-center"
            >
              <span>
                <IoEyeOutline />
              </span>
              <span>View Product</span>
            </Link>
          </button>
          {status === "wishlist" && (
            <button className="w-full px-4 py-2 rounded-lg text-gray-800 bg-[#ccccccc4] hover:bg-[#CCCCCC]">
              <div className="flex gap-2 justify-start items-center">
                <span>
                  <CiShoppingCart />
                </span>
                <span>Add to Cart</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import { formatDateTime } from "@/utils/DateFormat";
import Link from "next/link";
import { BsCart2, BsCartCheckFill } from "react-icons/bs";
import { FaRupeeSign } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { SiAudioboom } from "react-icons/si";
import {
  addProductToCart,
  addProductToWishlist,
  removeProductFromCart,
  removeProductFromWishlist,
} from "@/app/redux/feature/product/audio/api";
import { useAppDispatch } from "@/app/redux/hooks";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { useAppSelector } from "@/app/redux/hooks";

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
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.product);
  const handleCart = () => {
    if (loading) return;
    if (product.isPurchased) return;
    if (product.isInCart) {
      removeProductFromCart(dispatch, product._id, status as "wishlist");
    } else {
      addProductToCart(
        dispatch,
        product._id,
        product.variants[0]._id,
        status as "wishlist"
      );
    }
  };

  return (
    <>
      {
        <div className="w-full relative flex md:flex-row flex-col justify-start bg-white gap-4 items-start border-b rounded-lg md:p-4 ">
          <div className="md:w-1/3 md:h-[40vh] relative overflow-hidden">
            {product?.mediaType === "image" && (
              <img
                className="w-full h-full rounded-lg object-cover"
                src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}/${product.thumbnailKey}`}
                alt={product?.title}
              />
            )}
            {product?.mediaType === "audio" && (
              <img
                className="w-full h-full rounded-lg object-cover"
                src="/images/audioImage.png"
                alt={product?.title}
              />
            )}
            {product?.mediaType === "video" && (
              <div>
                <video
                  loop
                  muted
                  className="w-full h-full rounded-lg object-cover"
                >
                  <source
                    src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}/${product.thumbnailKey}`}
                  />
                </video>
              </div>
            )}

            <div className="absolute z-10 top-1 left-1 p-1 rounded-lg">
              {product?.mediaType === "image" && (
                <div
                  title="image"
                  className="bg-webred text-center text-white rounded-full p-2"
                >
                  <CiImageOn />
                </div>
              )}
              {product?.mediaType === "video" && (
                <div
                  title="video"
                  className="bg-webgreen text-center text-white rounded-full p-2"
                >
                  <MdOutlineSlowMotionVideo />
                </div>
              )}
              {product?.mediaType === "audio" && (
                <div
                  title="audio"
                  className="bg-webgreen text-center text-white rounded-full p-2"
                >
                  <SiAudioboom />
                </div>
              )}
            </div>
          </div>
          <div className="md:w-2/3 md:h-[40vh] flex flex-col justify-between items-start">
            <div className="mb-2">
              <div className="md:text-2xl capitalize font-bold">
                {product.title}
              </div>
              <div className=" text-left">
                <span className="text-gray-500 font-semibold">
                  ProductId :{" "}
                </span>
                <span className="text-sm">{product.uuid}</span>
              </div>
            </div>
            <div className="text-left">
              <span className="text-gray-500 font-semibold">
                Description :{" "}
              </span>
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
              <span className="text-sm">
                {formatDateTime(product.createdAt)}
              </span>
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
                  <span>View</span>
                </Link>
              </button>
              {status === "wishlist" && (
                <button
                  className={`w-full px-4 py-2 rounded-lg text-gray-800 bg-[#ccccccc4]  hover:bg-[#CCCCCC] ${
                    product.isPurchased && " cursor-default"
                  } `}
                >
                  <div className="flex gap-2 justify-start items-center">
                    {product.isPurchased ? (
                      <>
                        <span>
                          <BiSolidPurchaseTag />
                        </span>
                        <span className=" whitespace-nowrap ">Purchased</span>
                      </>
                    ) : (
                      <>
                        {product.isInCart ? (
                          <>
                            <span>
                              <BsCartCheckFill />
                            </span>
                          </>
                        ) : (
                          <>
                            <span>
                              <BsCart2 />
                            </span>
                          </>
                        )}
                        <span
                          onClick={handleCart}
                          className=" whitespace-nowrap "
                        >
                          {product.isInCart ? "Remove " : "Add"}
                        </span>
                      </>
                    )}
                  </div>
                </button>
              )}
            </div>
          </div>
          {status === "wishlist" && (
            <div
              title=" remove from wishlist "
              className="absolute top-1 right-1 p-1 rounded-lg"
            >
              <button
                className="bg-white text-gray-800 p-2 rounded-full"
                onClick={() =>
                  removeProductFromWishlist(
                    dispatch,
                    product._id,
                    status as "wishlist"
                  )
                }
              >
                <span>X</span>
              </button>
            </div>
          )}
        </div>
      }
    </>
  );
};

export default ProductCard;

import React, { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import type { TCustomerProduct } from "@/types/product";
import {
  addProductToCart,
  addProductToWishlist,
  removeProductFromCart,
  removeProductFromWishlist,
} from "@/app/redux/feature/product/audio/api";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useRouter, usePathname } from "next/navigation";
import {
  downloadProduct,
  removeItemFromLocalStorage,
  setCartInLocalStorage,
} from "@/app/redux/feature/product/api";
import { Spinner } from "@nextui-org/react";
import { FiDownload } from "react-icons/fi";
import { formatSecToMin } from "@/utils/DateFormat";
import { notifyWarn } from "@/utils/toast";
import { redirectToLogin } from "@/utils/redirectToLogin";
let currentPlayingWaveform: WaveSurfer | null = null;

const Waveform = ({
  product,
  productType = "audioData",
}: {
  product: TCustomerProduct;
  productType?: "audioData" | "imageData" | "videoData" | "similarProducts";
}) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);
  const { user } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const id = `waveform-${product._id}`;
    const track = document.querySelector(
      `#track-${product._id}`
    ) as HTMLAudioElement;
    const url = track?.src;

    if (!url) {
      console.error("Audio source URL is not available.");
      return;
    }

    const ws = WaveSurfer.create({
      barWidth: 2,
      cursorWidth: 1,
      container: `#${id}`,
      backend: "WebAudio",
      height: 80,
      progressColor: "#BBE445",
      waveColor: "#666666",
      cursorColor: "transparent",
    });

    const controller = new AbortController();
    const signal = controller.signal as any;

    ws.load(url, undefined, signal).catch((error) => {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("An error occurred:", error);
      }
    });

    ws.on("ready", () => {
      setLoading(false);
    });

    ws.on("error", (error) => {
      console.error("WaveSurfer error:", error);
      setLoading(false);
    });

    setWaveform(ws);

    track.addEventListener("ended", () => {
      setPlaying(false);
      ws.stop();
      if (currentPlayingWaveform === ws) {
        currentPlayingWaveform = null;
      }
    });

    return () => {
      ws.destroy();
    };
  }, [product._id]);

  const handlePlay = () => {
    if (waveform) {
      if (!playing) {
        if (currentPlayingWaveform && currentPlayingWaveform !== waveform) {
          currentPlayingWaveform.pause();
          currentPlayingWaveform.seekTo(0); // Reset the previous waveform to the start
        }
        waveform.play();
        currentPlayingWaveform = waveform;
      } else {
        waveform.pause();
        currentPlayingWaveform = null;
      }
      setPlaying(!playing);
    }
  };

  // const handleeWishlist = () => {
  //   if (product.isWhitelisted) {
  //     removeProductFromWishlist(dispatch, product._id, productType);
  //   } else {
  //     addProductToWishlist(
  //       dispatch,
  //       product._id,
  //       product.variants[0]._id,
  //       productType
  //     );
  //   }
  // };

  // const handleCart = () => {
  //   if (product.isInCart) {
  //     removeProductFromCart(dispatch, product._id, productType);
  //   } else {
  //     addProductToCart(
  //       dispatch,
  //       product._id,
  //       product.variants[0]._id,
  //       productType
  //     );
  //   }
  // };

  const handleDownload = async () => {
    setDownLoading(true);
    await downloadProduct(dispatch, product?.publicKey, product?.title);
    setDownLoading(false);
  };

  const handleeWishlist = async () => {
    if (!user) {
      redirectToLogin(router, pathname);
      return;
    }
    if (wishlistLoading) {
      notifyWarn("Action in progress. Please wait.");
      return;
    }

    setWishlistLoading(true);
    try {
      if (product?.isWhitelisted) {
        await removeProductFromWishlist(dispatch, product?._id, productType);
      } else {
        await addProductToWishlist(
          dispatch,
          product?._id,
          product?.variants[0]._id,
          productType
        );
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      notifyWarn("Failed to update wishlist. Please try again.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleCart = async () => {
    if (!user && !product.isInCart) {
      setCartInLocalStorage(
        { productId: product, variantId: product.variants[0]._id },
        dispatch,
        productType
      );
    }
    if (!user && product.isInCart) {
      removeItemFromLocalStorage(product._id, dispatch, productType);
    }
    if (cartLoading) {
      notifyWarn("Action in progress. Please wait.");
      return;
    }

    setCartLoading(true);
    try {
      if (product?.isInCart) {
        await removeProductFromCart(dispatch, product?._id, productType);
      } else {
        await addProductToCart(
          dispatch,
          product?._id,
          product?.variants[0]._id,
          productType
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      notifyWarn("Failed to update cart. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  const url =
    `${process.env.NEXT_PUBLIC_AWS_PREFIX}/${product.publicKey}` || "";

  const handleClick = (uuid: string) => {
    router.push(`/audio/${uuid}`);
  };
  const [downloading, setDownLoading] = useState(false);

  return (
    <div
      onClick={() => handleClick(product.uuid)}
      className="bg-gray-800 w-full justify-between rounded-lg px-4 py-2 mb-2 flex items-center cursor-pointer"
    >
      <div className="flex justify-start items-center lg:gap-3 md:gap-2 gap-1 w-4/12">
        <button
          className="play-button"
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          disabled={loading}
        >
          {loading ? (
            "Loading..."
          ) : !playing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#EA403E"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="none"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#EA403E"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#EA403E"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
          )}
        </button>
        <div>
          <h3 className="text-white font-semibold">{product.title || ""}</h3>
          <p className="flex gap-2 text-[#999999] text-sm">
            {product.tags.map((tag, idx) => (
              <span key={idx} className="text-[#999999]">
                {tag}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="lg:w-4/12 md:w-40 w-28 waveform-container hidden sm:block">
        <div className="wave" id={`waveform-${product._id}`} />
        <audio id={`track-${product._id}`} src={url} />
      </div>

      <div className="w-4/12 lg:gap-9 md:gap-5 gap-3 items-center justify-end flex text-right text-gray-400">
        <div className="flex items-center gap-2 text-right text-white">
          <p>{formatSecToMin(product.variants[0].metadata?.length || 0)} min</p>
          <p className="capitalize">{product.variants[0].metadata?.format}</p>
        </div>
        <div className="flex items-center gap-4 text-white">
          {!product.isPurchased ? (
            <button
              title={product.isInCart ? "Remove from cart" : "Add to cart"}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleCart();
              }}
            >
              {cartLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={product.isInCart ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              )}
            </button>
          ) : (
            <div
              title={"Purchased Product"}
              className={`p-2 bg-red-500 text-white rounded-full`}
            >
              <BiSolidPurchaseTagAlt />
            </div>
          )}
          <button
            title={product?.isWhitelisted ? "Remove from Saved" : "Save Image"}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleeWishlist();
            }}
          >
            {wishlistLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={product.isWhitelisted ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            )}
          </button>
          <button
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            {!downloading ? (
              <FiDownload className="h-6 w-6 font-semibold" />
            ) : (
              <svg
                className="animate-spin h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Waveform;

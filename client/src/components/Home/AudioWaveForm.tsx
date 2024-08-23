import React, { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import type { TCustomerProduct } from "@/types/product";
import {
  addAudioToWishlist,
  removeAudioFromWishlist,
  addAudioToCart,
  removeAudioFromCart,
} from "@/app/redux/feature/product/audio/api";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { useAppDispatch } from "@/app/redux/hooks";
import { useRouter } from "next/navigation";
import { downloadProduct } from "@/app/redux/feature/product/api";
import { Spinner } from "@nextui-org/react";
import { FiDownload } from "react-icons/fi";

let currentPlayingWaveform: WaveSurfer | null = null;

const Waveform = ({ product }: { product: TCustomerProduct }) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

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

  const handleAddToWishlist = () => {
    if (product.isWhitelisted) {
      removeAudioFromWishlist(dispatch, product._id);
    } else {
      addAudioToWishlist(dispatch, product._id, product.variants[0]._id);
    }
  };

  const handleAddToCart = () => {
    if (product.isInCart) {
      removeAudioFromCart(dispatch, product._id);
    } else {
      addAudioToCart(dispatch, product._id, product.variants[0]._id);
    }
  };

  const url = process.env.NEXT_PUBLIC_AWS_PREFIX + product.publicKey || "";

  const handleClick = (uuid: string) => {
    router.push(`/audio/${uuid}`);
  };
  const [downloading, setDownLoading] = useState(false);
  const handleDownload = async () => {
    if (!product) return;
    setDownLoading(true);
    await downloadProduct(dispatch, product.publicKey, product.title);
    setDownLoading(false);
  };

  return (
    <div
      onClick={() => handleClick(product.uuid)}
      className="bg-gray-800 w-full justify-between rounded-lg px-4 py-2 mb-2 flex items-center"
    >
      <div className="flex justify-start items-center gap-3 w-4/12 ">
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
          <p className="flex gap-2 text-[#999999]">
            {product.tags.map((tag) => (
              <span className="text-gray-400">{tag}</span>
            ))}
          </p>
        </div>
      </div>
      <div className="w-4/12 waveform-container">
        <div className="wave" id={`waveform-${product._id}`} />
        <audio id={`track-${product._id}`} src={url} />
      </div>
      <div className="w-4/12 gap-6 items-center justify-end flex text-right text-gray-400">
        <div className="flex items-center gap-2 text-right text-white">
          <p>{"2.5 min"}</p>
          <p>.mp3</p>
        </div>
        <div className="text-white items-center flex gap-3">
          <button
            className="cursor-pointer "
            onClick={(e) => {
              e.stopPropagation();
              handleAddToWishlist();
            }}
          >
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
          </button>
          {!product.isPurchased ? (
            <button
              className="cursor-pointer "
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
            >
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
            </button>
          ) : (
            <div
              title={"Purchased Product"}
              className={` p-2 bg-red-500 text-white rounded-full`}
            >
              <BiSolidPurchaseTagAlt />
            </div>
          )}

          <button
            className="cursor-pointer "
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            {!downloading ? (
              <>
                <FiDownload className=" h-6 w-6  font-semibold" />
              </>
            ) : (
              <Spinner className="w-6" label="" color="current" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Waveform;

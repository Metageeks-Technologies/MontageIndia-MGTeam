import React, { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import type { TCustomerProduct } from "@/types/product";
import {
  addAudioToWishlist,
  removeAudioFromWishlist,
} from "@/app/redux/feature/media/audio/api";
import { useAppDispatch } from "@/app/redux/hooks";

let currentPlayingWaveform: WaveSurfer | null = null;

const Waveform = ({ product }: { product: TCustomerProduct }) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);

  const dispatch = useAppDispatch();

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
      barWidth: 3,
      cursorWidth: 1,
      container: `#${id}`,
      backend: "WebAudio",
      height: 80,
      progressColor: "#2D5BFF",
      waveColor: "#EFEFEF",
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
      addAudioToWishlist(dispatch, product._id);
    }
  };

  const url = process.env.NEXT_PUBLIC_AWS_PREFIX + product.publicKey || "";

  return (
    <div className="bg-gray-800  w-full rounded-lg p-4 mb-2 flex items-center">
      <div className=" w-3/12 flex-grow">
        <h3 className="text-white font-semibold">{product.title || ""}</h3>
        <div className="text-white flex mt-3 gap-3">
          <button onClick={handleAddToWishlist} className=" ">
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
          <button>
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
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="w-6/12 waveform-container">
        <button className="play-button" onClick={handlePlay} disabled={loading}>
          {loading ? (
            "Loading..."
          ) : !playing ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            </>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
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

        <div className="wave" id={`waveform-${product._id}`} />
        <audio id={`track-${product._id}`} src={url} />
      </div>
      <div className="w-2/12 flex text-right text-gray-400"></div>
      <div className="w-1/12 text-right text-gray-400">
        <p>{"2.5 min"}</p>
        <p>{"4"} BPM</p>
      </div>
    </div>
  );
};

export default Waveform;

import React, { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import type { TCustomerProduct } from "@/types/product";

const Waveform = ({ product }: { product: TCustomerProduct }) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);

  useEffect(() => {
    const track = document.querySelector("#track") as HTMLAudioElement;
    const url = track.src;

    const ws = WaveSurfer.create({
      barWidth: 3,
      cursorWidth: 1,
      container: "#waveform",
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
    // ws.load(url);

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
    });

    return () => {
      // if (waveform) {
      //   waveform.destroy();
      // }
      ws.destroy();
    };
  }, []);

  const handlePlay = () => {
    if (waveform) {
      if (!playing) {
        waveform.play();
      } else {
        waveform.pause();
      }
      setPlaying(!playing);
    }
  };

  const url = process.env.NEXT_PUBLIC_AWS_PREFIX + product.publicKey || "";

  return (
    <div className="bg-gray-800  w-full rounded-lg p-4 mb-2 flex items-center">
      <div className=" w-3/12 flex-grow">
        <h3 className="text-white font-semibold">{product.title || ""}</h3>
        <p className="text-gray-400 text-sm">By {"shiva shah"}</p>
      </div>
      <div className="w-8/12 waveform-container">
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

        <div className="wave" id="waveform" />
        <audio id="track" src={url} />
      </div>
      <div className="w-1/12 text-right text-gray-400">
        <p>{"2.5 min"}</p>
        <p>{"4"} BPM</p>
      </div>
    </div>
  );
};

export default Waveform;

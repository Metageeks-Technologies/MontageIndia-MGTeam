import { useAppDispatch } from "@/app/redux/hooks";
import type { TCustomerProduct } from "@/types/product";
import { formatSecToMin } from "@/utils/DateFormat";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, CSSProperties } from "react";
import WaveSurfer from "wavesurfer.js";

let currentPlayingWaveform: WaveSurfer | null = null;

const DetailWaveform = ({ product }: { product: TCustomerProduct }) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [viewMode, setViewMode] = useState("desktop");
  const [waveHeight, setWaveHeight] = useState <Number>(300);

  const thumbRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

 
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width >= 1024) {
        setViewMode("desktop");
        setWaveHeight(300);
      } else if (width >= 768) {
        setViewMode("tablet");
        setWaveHeight(250);
      } else {
        setViewMode("mobile");
        setWaveHeight(100);
      }
    };

    // Set the initial viewMode based on current width
    handleResize();

    // Add event listener to handle resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  console.log("data", viewMode)

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
      barGap: 5,
      container: `#${id}`,
      backend: "WebAudio",
      height: waveHeight as number,
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
      setDuration(ws.getDuration());
    });

    ws.on("error", (error) => {
      console.error("WaveSurfer error:", error);
      setLoading(false);
    });

    ws.on("audioprocess", () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on("seeking", () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on("finish", () => {
      setCurrentTime(duration);
      setPlaying(false);
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

  const url =
    `${process.env.NEXT_PUBLIC_AWS_PREFIX}/${product.publicKey}` || "";

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (waveform) {
      const seekTo = parseFloat(e.target.value);
      waveform.seekTo(seekTo / duration);
      setCurrentTime(seekTo);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const progressBar: HTMLInputElement | null =
      document.querySelector(".progress-bar");
    if (progressBar && thumbRef.current) {
      const progress = (currentTime / duration) * 100;
      progressBar.style.setProperty("--progress", `${progress}%`);
      thumbRef.current.style.left = `calc(${progress}% - 10px)`; // Adjust to center the thumb
    }
  }, [currentTime, duration]);

  return (
    <div className="bg-gradient-to-r from-[#111721] to-[#323233] h-[24rem]  md:h-[32rem] lg:h-[32rem] px-8  w-full flex-col rounded-lg p-4 mb-2 flex items-center justify-center">
      <div className="w-full detail-waveform-container  flex items-start ">
        <div className="detail-wave  " id={`waveform-${product._id}`} />
        <audio className="" id={`track-${product._id}`} src={url} />
      </div>
      <div className="flex w-full items-center justify-center px-4 gap-4 cursor-pointer">
        <button
          style={detailPlayButtonStyle}
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          disabled={loading}
          className="w-3/12 flex justify-center items-center"
        >
          {loading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          ) : !playing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
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
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
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
        <div className="w-7/12 flex items-center">
          <div className="progress-container">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full progress-bar"
            />
            <div ref={thumbRef} className="custom-thumb"></div>
          </div>
        </div>
        <div className="w-2/12 flex text-right ms-4 text-gray-400">
          {formatSecToMin(currentTime)} / {formatSecToMin(duration)}
        </div>
      </div>
      <div className="w-2/12 flex text-right text-gray-400"></div>
    </div>
  );
};

export default DetailWaveform;

const detailPlayButtonStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "60px",
  height: "60px",
  backgroundColor: "#fe423f",
  borderRadius: "50%",
  border: "none",
  outline: "none",
  cursor: "pointer",
  paddingBottom: "3px",
};

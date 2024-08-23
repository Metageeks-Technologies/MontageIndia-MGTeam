import { useAppDispatch } from "@/app/redux/hooks";
import type { TCustomerProduct } from "@/types/product";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";

let currentPlayingWaveform: WaveSurfer | null = null;

const DetailWaveform = ({ product }: { product: TCustomerProduct }) => {
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
      barGap: 5,
      container: `#${id}`,
      backend: "WebAudio",
      height: 300,
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

  const url = process.env.NEXT_PUBLIC_AWS_PREFIX + product.publicKey || "";

  const handleClick = (uuid: string) => {
    router.push(`/audio/${uuid}`);
  };

  return (
    <div
      onClick={() => handleClick(product.uuid)}
      className="bg-gradient-to-r px-8 from-[#111721] to-[#323233] h-[32rem] w-full flex-col rounded-lg p-4 mb-2 flex items-center justify-center"
    >
      <div className="w-full detail-waveform-container ">
        <div className="detail-wave" id={`waveform-${product._id}`} />
        <audio id={`track-${product._id}`} src={url} />
      </div>
      <button
        style={detailPlayButtonStyle}
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

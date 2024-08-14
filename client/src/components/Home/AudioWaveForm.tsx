import React, { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

const Waveform: React.FC = () => {
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

  const url = "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3";

  return (
    <div className="waveform-container">
      <button className="play-button" onClick={handlePlay} disabled={loading}>
        {loading ? "Loading..." : !playing ? "Play" : "Pause"}
      </button>
      <div className="wave" id="waveform" />
      <audio id="track" src={url} />
    </div>
  );
};

export default Waveform;

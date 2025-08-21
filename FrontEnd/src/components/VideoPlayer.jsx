import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function VideoPlayer({
  src,
  type = "video/mp4",
  width = 640,
  height = 264,
}) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        fluid: true,
      });

      playerRef.current.on("ended", () => {
        console.log("Vídeo terminou!");
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        width={width}
        height={height}
        playsInline
      >
        <source src={src} type={type} />
      </video>
    </div>
  );
}

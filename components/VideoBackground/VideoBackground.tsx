"use client";

import React, { useRef, useEffect, useState } from "react";
import styles from "./VideoBackground.module.scss";

interface VideoBackgroundProps {
  src: string;
  className?: string;
  children?: React.ReactNode;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  className = "",
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [videoOpacity, setVideoOpacity] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      // Start playing the video once it's loaded
      video.play().catch(console.error);
    };

    const handleError = () => {
      setHasError(true);
      console.error("Video failed to load");
    };

    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    // Handle smooth looping with fade effect
    const handleTimeUpdate = () => {
      const duration = video.duration;
      const currentTime = video.currentTime;

      if (duration && currentTime) {
        const fadeStartTime = duration - 1; // Start fade 1 second before end
        const fadeEndTime = 1; // End fade 1 second after start

        if (currentTime >= fadeStartTime) {
          // Fade out near the end
          const fadeProgress = (currentTime - fadeStartTime) / 1;
          setVideoOpacity(1 - fadeProgress);
        } else if (currentTime <= fadeEndTime) {
          // Fade in at the beginning
          const fadeProgress = currentTime / fadeEndTime;
          setVideoOpacity(fadeProgress);
        } else {
          // Full opacity in the middle
          setVideoOpacity(1);
        }
      }
    };

    const handleEnded = () => {
      // Reset opacity and restart
      setVideoOpacity(0);
      video.currentTime = 0;
      video.play().catch(console.error);
    };

    // Add event listeners
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // Preload the video
    video.load();

    // Cleanup
    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Intersection Observer for performance optimization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(console.error);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  if (hasError) {
    return (
      <div className={`${styles.videoBackground} ${styles.error} ${className}`}>
        <div className={styles.fallbackBackground} />
        <div className={styles.content}>{children}</div>
      </div>
    );
  }

  return (
    <div className={`${styles.videoBackground} ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className={styles.loadingPlaceholder}>
          <div className={styles.loadingSpinner} />
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className={`${styles.video} ${isLoaded ? styles.loaded : ""}`}
        style={{ opacity: videoOpacity }}
        autoPlay
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Blur overlay */}
      <div className={styles.blurOverlay} />

      {/* Gradient overlay for better text readability */}
      <div className={styles.gradientOverlay} />

      {/* Content */}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default VideoBackground;

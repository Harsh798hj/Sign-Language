"use client";

import React, { useState, useRef } from "react";
import axios from "axios";

const Page = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [sign, setSign] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startDetection = async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsDetecting(true);

      const id = setInterval(async () => {
        await captureAndDetect();
      }, 2000);
      setIntervalId(id);
    } catch (error) {
      console.error("Error accessing the camera:", error);
      alert("Failed to access the camera. Please allow camera permissions.");
    }
  };

  const stopDetection = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsDetecting(false);
    setSign(null);
  };

  const captureAndDetect = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );

      if (imageBlob) {
        const formData = new FormData();
        formData.append("image", imageBlob);

        try {
          const response = await axios.post("http://127.0.0.1:5000/detect", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setSign(response.data.sign);
        } catch (error) {
          console.error("Error sending image to the backend:", error);
        }
      }
    }
  };

  const openGuide = () => {
    window.open("/guide.png", "_blank");
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <h1 style={styles.title}>Sign Language Detection</h1>
      <div style={styles.videoContainer}>
        <video ref={videoRef} style={styles.video as React.CSSProperties} />
      </div>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={isDetecting ? stopDetection : startDetection}>
          {isDetecting ? "Stop Detection" : "Start Detection"}
        </button>
        <button style={styles.button} onClick={openGuide}>
          Open Sign Language Guide
        </button>
      </div>
      {sign && (
        <div style={styles.resultContainer}>
          <h2>Detected Sign: {sign}</h2>
        </div>
      )}
    </div>
  );
};

export default Page;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
    padding: "2rem",
    position: "relative" as const,
    overflow: "hidden",
  },
  title: {
    fontSize: "clamp(1.5rem, 5vw, 2.5rem)", // Responsive font size
    marginBottom: "1.5rem",
    color: "#fff",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    zIndex: 1,
    textAlign: "center" as const,
  },
  videoContainer: {
    width: "90%",
    maxWidth: "600px",
    aspectRatio: "16/9",
    backgroundColor: "#000",
    borderRadius: "15px",
    overflow: "hidden",
    marginBottom: "1.5rem",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap" as const, // Wrap buttons on small screens
    gap: "1rem",
    marginBottom: "1.5rem",
    zIndex: 1,
    justifyContent: "center",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    fontWeight: "600",
    letterSpacing: "0.5px",
    zIndex: 1,
    flex: "1 1 auto", // Allow buttons to grow and shrink
    minWidth: "150px", // Minimum width for buttons
  },
  resultContainer: {
    marginTop: "1.5rem",
    padding: "1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "15px",
    textAlign: "center" as const,
    width: "90%",
    maxWidth: "600px",
    zIndex: 1,
  },
  background: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(45deg, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee, #84fab0)",
    backgroundSize: "400% 400%",
    animation: "gradientAnimation 15s ease infinite",
    zIndex: 0,
  },
};

// Add global styles for the animated background
const globalStyles = `
  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

// Inject global styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);
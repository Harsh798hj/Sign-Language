"use client";
import { motion } from "framer-motion";
import React from "react";

export default function modal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="modal-content">
        <h2>Sign Language Guide</h2>
        <p>Here’s a chart of common sign language symbols.</p>
        {/* Add your chart content here */}
        <button onClick={onClose}>Close</button>
      </div>
    </motion.div>
  );
}

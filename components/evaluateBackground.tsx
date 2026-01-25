"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EVALUATE_EMOJIS = ["⚖️", "📊", "📈", "📉", "🧠"];

type EvaluateParticle = {
  id: number;
  left: string;
  scale: number;
  duration: number;
  delay: number;
  emoji: string;
};

export default function EvaluateBackground() {
  const [particles, setParticles] = useState<EvaluateParticle[]>([]);

  useEffect(() => {
    const particleNumber = 4;

    const newParticles = Array.from({ length: particleNumber }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      scale: Math.random() * 0.2 + 0.5,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 3,
      emoji:
        EVALUATE_EMOJIS[Math.floor(Math.random() * EVALUATE_EMOJIS.length)],
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute -bottom-12.5 text-4xl"
          style={{
            left: particle.left,
            filter: "drop-shadow(0 0 10px rgba(255, 200, 0, 0.4))",
          }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{
            y: "-110vh",
            opacity: [0, 1, 1, 0],
            scale: [particle.scale, particle.scale * 1.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-yellow-300/20 to-transparent" />
    </div>
  );
}

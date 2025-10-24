'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Particle = {
  id: number;
  size: number;
  color: string;
  left: string;
  top: string;
  xMove: number;
  duration: number;
  delay: number;
};

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  // ✅ Only runs on the client, after initial render
  useEffect(() => {
    const generated = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      color:
        Math.random() > 0.5
          ? 'rgba(220, 38, 38, 0.4)'
          : 'rgba(234, 179, 8, 0.4)',
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      xMove: Math.random() * 20 - 10,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(generated);
  }, []); // only runs once

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.xMove, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

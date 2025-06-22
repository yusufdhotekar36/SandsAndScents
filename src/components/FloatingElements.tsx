import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements = () => {
  const elements = [
    { size: 40, delay: 0 },
    { size: 60, delay: 1 },
    { size: 30, delay: 2 },
    { size: 50, delay: 3 },
    { size: 35, delay: 4 },
    { size: 45, delay: 5 },
  ];

  return (
    <div className="floating-elements">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="floating-element"
          style={{
            width: element.size,
            height: element.size,
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6 + element.delay,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Sand particles */}
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={`sand-${index}`}
          className="sand-particle"
          style={{
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
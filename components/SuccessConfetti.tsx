import React, { useEffect, useState } from 'react';

export const SuccessConfetti: React.FC = () => {
  const [particles, setParticles] = useState<Array<{x: number, y: number, color: string, speedX: number, speedY: number}>>([]);

  useEffect(() => {
    const colors = ['#f97316', '#fbbf24', '#34d399', '#60a5fa', '#f472b6'];
    const count = 100;
    const newParticles = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: 50, // Start from center-ish (percentage)
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2 - 1, // Upwards bias
      });
    }
    setParticles(newParticles);
    
    const interval = setInterval(() => {
        setParticles(prev => prev.map(p => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            speedY: p.speedY + 0.05 // Gravity
        })).filter(p => p.y < 110)); // Remove if off screen
    }, 16);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((p, i) => (
            <div 
                key={i}
                className="absolute w-2 h-2 rounded-sm"
                style={{
                    left: `${50 + p.x * 10}%`, // Spread out
                    top: `${50 + p.y * 10}%`, 
                    backgroundColor: p.color,
                    transform: `rotate(${p.x * 20}deg)`
                }}
            />
        ))}
    </div>
  );
};
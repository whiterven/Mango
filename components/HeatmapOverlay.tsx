
import React from 'react';

interface Point {
  x: number;
  y: number;
  intensity: number;
}

interface Props {
  points: Point[];
  visible: boolean;
}

export const HeatmapOverlay: React.FC<Props> = ({ points, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-10 mix-blend-hard-light opacity-80">
      {points.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-2xl"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.intensity * 150}px`,
            height: `${p.intensity * 150}px`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,255,0,0.6) 40%, rgba(0,0,255,0) 70%)`
          }}
        />
      ))}
    </div>
  );
};

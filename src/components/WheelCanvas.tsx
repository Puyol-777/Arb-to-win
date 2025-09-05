import React, { useEffect, useRef } from 'react';
import { Prize } from '../types';

interface WheelCanvasProps {
  prizes: Prize[];
  rotation: number;
  size: number;
}

export function WheelCanvas({ prizes, rotation, size }: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const anglePerSegment = (2 * Math.PI) / prizes.length;
    
    console.log('🎨 === DESSIN DE LA ROUE ===');
    console.log(`📐 Angle par segment: ${(anglePerSegment * 180/Math.PI).toFixed(1)}°`);
    
    // Dessiner les segments en commençant par le haut (0°) et en allant dans le sens horaire
    prizes.forEach((prize, index) => {
      // Commencer à 0° (en haut) pour le segment 0
      const startAngle = index * anglePerSegment - Math.PI / 2;
      const endAngle = (index + 1) * anglePerSegment - Math.PI / 2;
      
      const startDegrees = (startAngle * 180/Math.PI).toFixed(1);
      const endDegrees = (endAngle * 180/Math.PI).toFixed(1);
      const centerDegrees = ((startAngle + anglePerSegment/2) * 180/Math.PI).toFixed(1);
      
      console.log(`🎨 Segment ${index} "${prize.label}": ${startDegrees}° → ${endDegrees}° (centre: ${centerDegrees}°)`);
      
      // Dessiner le segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = prize.color;
      ctx.fill();
      
      // Bordure
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Texte et icône au centre du segment
      const centerAngle = startAngle + anglePerSegment / 2;
      const textRadius = radius * 0.7;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(centerAngle);
      
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Icône
      ctx.font = '20px Arial';
      ctx.fillText(prize.icon, textRadius, -10);
      
      // Texte
      ctx.font = 'bold 10px Arial';
      const cleanLabel = prize.label.replace(new RegExp(prize.icon, 'g'), '').trim();
      const words = cleanLabel.split(' ');
      
      // Gérer le texte long
      const maxWidth = 80;
      let lines = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // Dessiner chaque ligne
      lines.forEach((line, i) => {
        ctx.fillText(line, textRadius, 10 + i * 12);
      });
      
      ctx.restore();
    });

    // Centre de la roue
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#1F2937';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

  }, [prizes, size]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: rotation > 0 ? 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
        }}
        className="drop-shadow-lg"
      />
      
      {/* Pointeur en haut */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-10">
        <div className="flex flex-col items-center">
          <div 
            className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-transparent border-t-red-600"
            style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.7))' }}
          />
          <div className="w-0.5 h-3 bg-red-600 mt-0.5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}></div>
        </div>
      </div>
    </div>
  );
}
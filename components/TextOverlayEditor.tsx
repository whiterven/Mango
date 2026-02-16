
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { fileToBase64 } from '../services/geminiService';
import { creativeAnalysisAgent, CreativeAnalysisResult } from '../agents/creativeAnalysisAgent';
import { Badge } from './ui/Badge';

interface Props {
  imageUrl: string;
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export const TextOverlayEditor: React.FC<Props> = ({ imageUrl, onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Text State
  const [text, setText] = useState('Your Hook Here');
  const [color, setColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(48);
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);
  
  // Logo State
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoX, setLogoX] = useState(85);
  const [logoY, setLogoY] = useState(15);
  const [logoScale, setLogoScale] = useState(20);

  // Tools State
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [cropGuide, setCropGuide] = useState<'none' | '1:1' | '4:5' | '9:16'>('none');
  
  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CreativeAnalysisResult | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setLogoUrl(`data:image/png;base64,${base64}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAnalyze = async () => {
      if (!canvasRef.current) return;
      setIsAnalyzing(true);
      setShowHeatmap(true);
      
      try {
          // Send the current canvas state (with text/logo) to AI
          const currentImage = canvasRef.current.toDataURL('image/jpeg', 0.8);
          const base64 = currentImage.split(',')[1];
          const result = await creativeAnalysisAgent(base64);
          setAnalysisResult(result);
      } catch (e) {
          console.error("Analysis failed", e);
          alert("Could not analyze image. Try again.");
          setShowHeatmap(false);
      } finally {
          setIsAnalyzing(false);
      }
  };

  const toggleHeatmap = () => {
      if (!showHeatmap && !analysisResult) {
          handleAnalyze();
      } else {
          setShowHeatmap(!showHeatmap);
      }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 1. Draw Base Image
      ctx.drawImage(img, 0, 0);
      
      // 2. Draw Logo (if exists)
      if (logoUrl) {
        const logo = new Image();
        logo.src = logoUrl;
        logo.onload = () => {
           const aspect = logo.width / logo.height;
           const targetWidth = (logoScale / 100) * canvas.width;
           const targetHeight = targetWidth / aspect;
           const lx = (logoX / 100) * canvas.width - (targetWidth / 2);
           const ly = (logoY / 100) * canvas.height - (targetHeight / 2);
           
           ctx.drawImage(logo, lx, ly, targetWidth, targetHeight);
           drawOverlays(ctx, canvas); // Draw overlays after logo
        };
      } else {
        drawOverlays(ctx, canvas);
      }
    };
  };

  const drawOverlays = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      // 3. Draw Text
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.fillText(text, (textX / 100) * canvas.width, (textY / 100) * canvas.height);

      // 4. Heatmap (Real AI Data)
      if (showHeatmap && analysisResult) {
          ctx.globalCompositeOperation = 'overlay'; // Blend mode
          
          analysisResult.heatmapPrediction.focalPoints.forEach(point => {
              const x = (point.x / 100) * canvas.width;
              const y = (point.y / 100) * canvas.height;
              const radius = Math.max(canvas.width, canvas.height) * 0.2 * point.intensity;

              const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
              gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)'); // Hot center
              gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.4)'); // Warm middle
              gradient.addColorStop(1, 'rgba(0, 0, 255, 0)'); // Cool/transparent edge

              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
          });

          ctx.globalCompositeOperation = 'source-over'; // Reset blend mode
          
          // Draw focal point markers
          ctx.font = 'bold 20px sans-serif';
          ctx.fillStyle = 'white';
          ctx.shadowColor = 'black';
          ctx.shadowBlur = 4;
          
          analysisResult.heatmapPrediction.focalPoints.forEach((point, i) => {
               const x = (point.x / 100) * canvas.width;
               const y = (point.y / 100) * canvas.height;
               ctx.beginPath();
               ctx.arc(x, y, 5, 0, 2 * Math.PI);
               ctx.fill();
               ctx.fillText(`${i+1}`, x + 10, y - 10);
          });
      } else if (showHeatmap && isAnalyzing) {
          // Loading overlay
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.font = 'bold 30px sans-serif';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.fillText("AI ANALYZING...", canvas.width / 2, canvas.height / 2);
      }

      // 5. Crop Guides
      if (cropGuide !== 'none') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          const w = canvas.width;
          const h = canvas.height;
          let guideW = w;
          let guideH = h;

          if (cropGuide === '1:1') guideH = w; // Square relative to width
          if (cropGuide === '4:5') guideH = w * 1.25;
          if (cropGuide === '9:16') guideH = w * (16/9);

          // If the guide height is taller than canvas, we scale width down instead
          if (guideH > h) {
             guideH = h;
             if (cropGuide === '1:1') guideW = h;
             if (cropGuide === '4:5') guideW = h * 0.8;
             if (cropGuide === '9:16') guideW = h * (9/16);
          }

          const offsetX = (w - guideW) / 2;
          const offsetY = (h - guideH) / 2;

          // Draw dark areas outside crop
          ctx.fillRect(0, 0, w, offsetY); // Top
          ctx.fillRect(0, h - offsetY, w, offsetY); // Bottom
          ctx.fillRect(0, offsetY, offsetX, guideH); // Left
          ctx.fillRect(w - offsetX, offsetY, offsetX, guideH); // Right
          
          // Border
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;
          ctx.strokeRect(offsetX, offsetY, guideW, guideH);
      }
  };

  useEffect(() => {
    draw();
  }, [imageUrl, text, color, fontSize, textX, textY, showHeatmap, logoUrl, logoX, logoY, logoScale, cropGuide, analysisResult, isAnalyzing]);

  const handleSave = () => {
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL('image/png'));
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <div className="flex-1 bg-black/50 rounded-lg flex items-center justify-center p-4 border border-slate-700 overflow-hidden relative">
        <canvas 
          ref={canvasRef} 
          className="max-w-full max-h-[70vh] shadow-2xl"
        />
        {showHeatmap && analysisResult && (
            <div className="absolute top-4 right-4 bg-black/80 text-white text-[10px] p-2 rounded border border-white/20">
                AI Eye-Tracking Prediction
            </div>
        )}
      </div>
      
      <div className="w-full md:w-80 bg-slate-900 p-5 border-l border-slate-800 space-y-6 overflow-y-auto">
        
        {/* TEXT CONTROLS */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase mb-3">Text Layer</h3>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white text-xs mb-3"
          />
          <div className="grid grid-cols-2 gap-4 mb-2">
             <div>
               <label className="text-[10px] text-slate-500 block mb-1">Size</label>
               <input type="range" min="20" max="200" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-1" />
             </div>
             <div>
               <label className="text-[10px] text-slate-500 block mb-1">Color</label>
               <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-6 bg-transparent border-0" />
             </div>
          </div>
          <div className="flex gap-2 text-[10px] text-slate-400">
             <span>Pos X</span>
             <input type="range" min="0" max="100" value={textX} onChange={(e) => setTextX(Number(e.target.value))} className="flex-1 h-1" />
             <span>Pos Y</span>
             <input type="range" min="0" max="100" value={textY} onChange={(e) => setTextY(Number(e.target.value))} className="flex-1 h-1" />
          </div>
        </div>

        {/* LOGO CONTROLS */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-white font-bold text-xs uppercase">Logo Layer</h3>
             <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleLogoUpload} 
             />
             <button onClick={() => fileInputRef.current?.click()} className="text-[10px] text-brand-400 hover:underline">
                 {logoUrl ? 'Change Logo' : 'Upload Logo'}
             </button>
          </div>
          
          {logoUrl && (
              <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                      <span>Scale</span>
                      <input type="range" min="5" max="50" value={logoScale} onChange={(e) => setLogoScale(Number(e.target.value))} className="h-1" />
                  </div>
                  <div className="flex gap-2 text-[10px] text-slate-400">
                    <span>Pos X</span>
                    <input type="range" min="0" max="100" value={logoX} onChange={(e) => setLogoX(Number(e.target.value))} className="flex-1 h-1" />
                    <span>Pos Y</span>
                    <input type="range" min="0" max="100" value={logoY} onChange={(e) => setLogoY(Number(e.target.value))} className="flex-1 h-1" />
                  </div>
              </div>
          )}
        </div>

        {/* TOOLS */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
             {/* Heatmap Toggle */}
             <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-slate-300">AI Attention Heatmap</span>
                 <button 
                    onClick={toggleHeatmap}
                    disabled={isAnalyzing}
                    className={`w-10 h-5 rounded-full relative transition-colors ${showHeatmap ? 'bg-brand-600' : 'bg-slate-700'}`}
                 >
                     <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showHeatmap ? 'left-6' : 'left-1'}`}></div>
                 </button>
             </div>
             
             {isAnalyzing && <div className="text-[10px] text-brand-400 animate-pulse">Running eye-tracking simulation...</div>}

             {/* Analysis Results Display */}
             {analysisResult && (
                 <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                     <div className="flex justify-between items-center mb-2">
                         <h4 className="text-[10px] font-bold text-slate-400 uppercase">Creative Score</h4>
                         <span className={`text-sm font-black ${analysisResult.scores.attention > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                             {analysisResult.scores.attention}/100
                         </span>
                     </div>
                     <div className="space-y-1">
                         {analysisResult.feedback.weaknesses.slice(0, 2).map((w, i) => (
                             <div key={i} className="flex gap-2 text-[9px] text-red-300 items-start">
                                 <span>•</span>
                                 <span>{w}</span>
                             </div>
                         ))}
                     </div>
                 </div>
             )}

             {/* Crop Guides */}
             <div>
                 <span className="text-xs font-bold text-slate-300 block mb-2">Aspect Ratio Guide</span>
                 <div className="flex gap-1">
                     {['none', '1:1', '4:5', '9:16'].map(r => (
                         <button 
                            key={r}
                            onClick={() => setCropGuide(r as any)}
                            className={`flex-1 py-1 text-[10px] rounded border ${
                                cropGuide === r 
                                ? 'bg-brand-600 border-brand-500 text-white' 
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                         >
                             {r === 'none' ? 'Off' : r}
                         </button>
                     ))}
                 </div>
             </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
            <Button onClick={handleSave} className="w-full">Save Image</Button>
            <Button variant="outline" onClick={onCancel} className="w-full">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

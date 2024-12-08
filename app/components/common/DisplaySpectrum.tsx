import { useEffect, useRef } from "react";
import { useStore } from "../../stores/UseStore";

const FULL_HUE_DEGREES = 270;
const CANVAS_HEIGHT = 100;

export default function DisplaySpectrum() {
  // Global State
  const audioArrayData = useStore((state) => state.audioArrayData);
  const refSpectrum = useRef<HTMLCanvasElement | null>(null);
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);

  const drawAudioSpectrum = (audioData: Uint8Array) => {
    if (!audioArrayData || !refSpectrum.current || !canvasContext.current) return;

    const canvas = refSpectrum.current;
    const context = canvasContext.current;

     // キャンバスをクリア
     context.clearRect(0, 0, canvas.width, canvas.height);
     context.fillStyle = '#000';
     context.fillRect(0, 0, canvas.width, canvas.height);
 
     const barWidth = (canvas.width / audioData.length);

     // 水平方向の目盛り線（上下）
    context.beginPath();
    context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    for(let i = 0; i <= 4; i++) {
      const y = (canvas.height / 4) * i;
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
    }
    context.stroke();

    // スペクトラムとインデックス番号の描画
    for(let i = 0; i < audioData.length; i++) {
      const barHeight = (audioData[i] / 255) * canvas.height;
      const x = i * barWidth;
      const hue = (i / audioData.length) * FULL_HUE_DEGREES;
      
      context.fillStyle = `hsl(${hue}, 100%, 50%)`;
      context.fillRect(x, canvas.height, barWidth, -barHeight);
      
      // インデックス番号の描画
      context.fillStyle = '#fff';
      context.font = '8px Arial';
      context.textAlign = 'center';
      context.fillText(i.toString(), x + barWidth/2, canvas.height - 10);
    }
  }

  useEffect(() => {
    if(audioArrayData && refSpectrum.current) {
      canvasContext.current = refSpectrum.current.getContext('2d');
      refSpectrum.current.width = window.innerWidth;
      refSpectrum.current.height = CANVAS_HEIGHT;

      let animationFrameId: number;
      
      const update = () => {
        drawAudioSpectrum(audioArrayData);
        animationFrameId = requestAnimationFrame(update);
      }
      
      update();
      
      // クリーンアップ関数を追加
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    } else {
      // console.log('no audio data');
    }
  }, [audioArrayData]);

  return (
    <div className="w-full fixed bottom-0 left-0 h-[100px] z-10">
      <canvas ref={refSpectrum} className="w-full h-full"></canvas>
    </div>
  );
}

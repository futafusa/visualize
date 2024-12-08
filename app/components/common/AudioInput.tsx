import { useControls, button } from "leva";
import { useRef, useEffect, useState } from "react";
import { useStore } from "../../stores/UseStore";
import DisplaySpectrum from "./DisplaySpectrum";

// const FFT_SIZE = 64; // min 32

export default function AudioInput({ FFT_SIZE = 64 }: { FFT_SIZE?: number }) {
  // UI Controls
  const { audioAmplification, displaySpectrum } = useControls('Audio Input', {
    'Mic On': button(() => {
      createStreamSource(FFT_SIZE);
    }),
    audioAmplification: { 
      value: 1, 
      min: 0, 
      max: 2, 
      step: 0.1 
    },
    displaySpectrum: {
      value: true,
    },
  });

  // Global State
  const audioArrayData = useStore((state) => state.audioArrayData);
  const setAudioArrayData = useStore((state) => state.setAudioArrayData);

  // Audio Context
  const audioContext = useRef<AudioContext | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // Create Stream Source
  const createStreamSource = async (FFT_SIZE: number) => {
    try {
      const streamSource = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new AudioContext();
      const audioSourceNode = audioContext.current.createMediaStreamSource(streamSource);

      const analyserNode = audioContext.current.createAnalyser();
      analyserNode.fftSize = FFT_SIZE*2;
      // analyserNode.smoothingTimeConstant = 0.8;
      audioSourceNode.connect(analyserNode);

      setAnalyserNode(analyserNode);
    } catch (error) {
      console.error(error);
    }
  };

  // Update Audio Data
  useEffect(() => {
    if(analyserNode) {
      const bufferLength = analyserNode.frequencyBinCount;
      const audioArrayData = new Uint8Array(bufferLength);
      const amplifiedData = new Uint8Array(bufferLength);

      let animationFrameId: number;

      function update() {
        if(analyserNode) {
          analyserNode.getByteFrequencyData(audioArrayData);

          for(let i = 0; i < bufferLength; i++) {
            amplifiedData[i] = Math.min(audioArrayData[i] * audioAmplification, 255);
          }

          setAudioArrayData(amplifiedData);
        }

        animationFrameId = requestAnimationFrame(update);
      }

      update();

      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [analyserNode, audioAmplification]);

  return (
    <>
      {displaySpectrum && <DisplaySpectrum />}
    </>
  );
}

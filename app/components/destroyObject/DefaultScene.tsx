import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

import Model from "./Model";

type ModelData = {
  id: number;
  shape: string;
  position: [number, number, number];
  speed: number;
}

export default function MainScene() {
  const [modelId, setModelId] = useState(0);
  const [models, setModels] = useState<ModelData[]>([]);
  
  useFrame(() => {
    if(Math.random() > 0.02) return;

    setModels((prev) => [
      ...prev,
      {
        id: modelId,
        shape: Math.random() < 0.4 ? "cube" : Math.random() < 0.8 ? "sphere" : "cylinder",
        position: [Math.random() * 10 - 5, 1, -5],
        speed: Math.random() * 0.1 + 0.005
      }
    ]);
  });

  useEffect(() => {
    setModelId(modelId + 1);
    console.log(models);
  }, [models]);

  function handleDestroy(id: number) {
    setModels((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <>
      {models.map((model) => (
        <Model
          key={model.id}
          shape={model.shape}
          position={model.position}
          speed={model.speed}
          onDestroy={() => handleDestroy(model.id)}
        />
      ))}
    </>
  );
}

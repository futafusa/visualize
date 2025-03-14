import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useVRM } from "./useVRM";

import Model from "./Model";
import ModelRoad from "./ModelRoad";

type ModelData = {
  id: number;
  shape: string;
  position: [number, number, number];
  speed: number;
}

export default function MainScene() {
  const [modelId, setModelId] = useState(0);
  const [models, setModels] = useState<ModelData[]>([]);

  useEffect(() => {
    setModelId(modelId + 1);
    console.log(models);
  }, [models]);
  
  useFrame(() => {
    if(Math.random() > 0.03) return;

    setModels((prev) => [
      ...prev,
      {
        id: modelId,
        shape: Math.random() < 0.4 ? "cube" : Math.random() < 0.8 ? "sphere" : "cylinder",
        position: [Math.random() > 0.5 ? Math.random() * 8 + 1 : Math.random() * -8 - 1, 0.5, -20],
        speed: 0.05
      }
    ]);
  });

  function handleDestroy(id: number) {
    setModels((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <>
      {Array.from({ length: 4 }, (_, i) => (
        <ModelRoad
          key={i}
          position={[0, 0.01, -i * 10]}
          speed={0.05}
          onDestroy={() => handleDestroy(i)}
        />
      ))}
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

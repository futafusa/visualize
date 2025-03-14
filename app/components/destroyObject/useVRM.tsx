import { useState, useCallback, useEffect } from "react";
import { VRM, VRMUtils, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const useVRM = (initialPath: string) => {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));

  const loadVRM = useCallback((path: string) => {
    loader.load(
      path,
      (gltf) => {
        const vrmData = gltf.userData.vrm;
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.combineSkeletons(gltf.scene);
        VRMUtils.combineMorphs(vrmData);
        setVrm(vrmData);
      },
      (xhr) => {
        setProgress((xhr.loaded / xhr.total) * 100);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  useEffect(() => {
    loadVRM(initialPath);
  }, [initialPath, loadVRM]);

  return { vrm, progress, loadVRM };
};
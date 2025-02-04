import { useState, useEffect } from "react";

export default function DropVRM({ progress, loadVRM }: { progress: number, loadVRM: (path: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.vrm')) {
      const url = URL.createObjectURL(file);
      loadVRM(url);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <div
      className="
        absolute bottom-0 left-0
        z-1000
        flex justify-center items-center
        px-4 pb-4
      "
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`
          rounded-lg border border-dashed border-white/50
          bg-black/50
          w-[200px] h-[60px]
          flex justify-center items-center
          transition-height duration-300
          ${isDragging ? 'h-[120px] bg-black/30' : 'h-[60px] bg-black/50'}
        `}
      >
        <p
          className="text-white text-center text-sm pointer-events-none"
        >
          {progress < 100 ? `Loading... ${progress}%` : 'Drag & Drop .vrm Data'}
        </p>
      </div>
    </div>
  );
}
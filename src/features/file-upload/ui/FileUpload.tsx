import { ImageUp } from "lucide-react";
import { useState } from "react";

type FileUploadProps = {
  onUpload: (file: File) => void;
};

function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
  }

  function handleDragEnter(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    onUpload(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    onUpload(file);
  }

  return (
    <label
      className={`text-text relative font-golos max-w-1/2 h-full bg-linear-135 group from-[color-mix(in_srgb,var(--color-surface)_60%,var(--color-border))] to-surface flex flex-col transition-all duration-200 items-center justify-center w-full cursor-pointer border rounded-xl p-6 border-border focus-within:shadow-[0_0_40px_rgba(150,130,232,0.2)] ${isDragging ? "shadow-[0_0_40px_rgba(150,130,232,0.2)]" : ""}`}
      htmlFor="image"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <svg
        className={`absolute inset-0 h-full w-full pointer-events-none ${isDragging ? "text-accent" : "text-accent/50"}`}
        preserveAspectRatio="none"
      >
        <rect
          x={isDragging ? "1" : "20"}
          y={isDragging ? "1" : "20"}
          width={isDragging ? "calc(100% - 2px)" : "calc(100% - 40px)"}
          height={isDragging ? "calc(100% - 2px)" : "calc(100% - 40px)"}
          rx="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${isDragging ? "20000" : "6 6"}`}
          className="group-hover:animate-[dash_600ms_linear_infinite] transition-all duration-200"
        />
      </svg>

      <input
        className="absolute -z-1 block w-0 h-0 opacity-0"
        type="file"
        accept="image/*"
        name="image"
        id="image"
        onChange={handleChange}
      />

      <div className="flex flex-col gap-5 rounded-xl items-center overflow-hidden justify-center p-10 w-full h-full transition-background duration-200 group-hover:bg-accent/5">
        <div className="rounded-full p-4 text-accent bg-accent/20 transition-all">
          <ImageUp size={80} strokeWidth={1.5} />
        </div>
        <p className="text-2xl font-semibold text-center">
          {isDragging ? (
            "Drop image here"
          ) : (
            <>
              Drop files here or{" "}
              <span className="text-accent">click to upload</span>
            </>
          )}
        </p>
        <p className="text-text-muted text-sm text-center">
          JPG, PNG &bull; Files never leave your browser
        </p>
      </div>
    </label>
  );
}

export default FileUpload;

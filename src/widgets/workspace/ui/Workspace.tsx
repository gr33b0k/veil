import { useState } from "react";

import { FileUpload, type Tool, type CensorType } from "@/features";
import { ImageEditor } from "@/widgets";
import { Lock, SlidersHorizontal, WandSparkles } from "lucide-react";
import { SettingsPanel } from "@/widgets/settings-panel";

type WorkspaceProps = {
  image: File | null;
  onImageChange: (image: File) => void;
};

const features = [
  {
    title: "Local processing",
    description: "Runs directly in your browser",
    icon: Lock,
  },
  {
    title: "Your control",
    description: "Choose what gets censored",
    icon: SlidersHorizontal,
  },
  {
    title: "Simple workflow",
    description: "Upload, edit, and export",
    icon: WandSparkles,
  },
];

function Workspace({ image, onImageChange }: WorkspaceProps) {
  const [tool, setTool] = useState<Tool>("cursor");

  const [brushSize, setBrushSize] = useState(50);
  const [blurIntensity, setBlurIntensity] = useState(5);
  const [censorType, setCensorType] = useState<CensorType>("blur");

  return (
    <main
      className={`relative h-full w-full flex overflow-hidden ${
        !image ? "flex-col justify-center items-center p-15 gap-10" : ""
      }`}
    >
      {!image ? (
        <>
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-text text-5xl font-golos font-medium">
              Redact <span className="text-accent">private</span> info. <br />{" "}
              Keep what matters.
            </h1>
            <p className="text-text-muted text-lg ">
              Veil helps you censor sensetive details from images <br />
              locally, securely, and effortlessly
            </p>
          </div>
          <FileUpload onUpload={onImageChange} />
          <ul className="flex items-center">
            {features.map(({ title, description, icon: Icon }) => (
              <li
                key={title}
                className="flex items-center gap-2 text-text px-5 border-r-2 border-r-border last-of-type:border-r-0"
              >
                <div className="text-accent flex items-center justify-center bg-border rounded-lg p-3">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-text-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <ImageEditor
            image={image}
            tool={tool}
            setTool={setTool}
            brushSize={brushSize}
            blurIntensity={blurIntensity}
            censorType={censorType}
          />
          <SettingsPanel
            tool={tool}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            blurIntensity={blurIntensity}
            onBlurIntensityChange={setBlurIntensity}
            censorType={censorType}
            onCensorTypeChange={setCensorType}
          />
        </>
      )}
    </main>
  );
}

export default Workspace;

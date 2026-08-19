import { useState } from "react";

import { FileUpload } from "@/features";
import { ImageViewer } from "@/widgets";
import { Lock, SlidersHorizontal, WandSparkles } from "lucide-react";

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

function Workspace() {
  const [image, setImage] = useState<File | null>(null);

  return (
    <main
      className={`relative h-full w-full flex overflow-hidden p-6 gap-4 ${
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
          <FileUpload onUpload={setImage} />
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
        <ImageViewer image={image} />
      )}
    </main>
  );
}

export default Workspace;

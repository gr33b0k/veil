import { useRef, useState } from "react";

import { Header, Workspace } from "@/widgets";
import { Background } from "@/shared";

function HomePage() {
  const [image, setImage] = useState<File | null>(null);
  const exportImageRef = useRef<(() => Promise<void>) | null>(null);

  const mode = image ? "editor" : "landing";
  return (
    <>
      {!image && <Background />}

      <Header mode={mode} onExport={() => exportImageRef.current?.()} />
      <Workspace
        image={image}
        onImageChange={setImage}
        exportImageRef={exportImageRef}
      />
    </>
  );
}

export default HomePage;

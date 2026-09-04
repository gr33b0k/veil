import { useState } from "react";

import { Header, Workspace } from "@/widgets";
import { Background } from "@/shared";

function HomePage() {
  const [image, setImage] = useState<File | null>(null);

  const mode = image ? "editor" : "landing";
  return (
    <>
      {!image && <Background />}

      <Header mode={mode} />
      <Workspace image={image} onImageChange={setImage} />
    </>
  );
}

export default HomePage;

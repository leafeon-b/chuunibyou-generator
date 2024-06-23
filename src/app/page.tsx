"use client";

import { unstable_noStore as noStore } from "next/cache";
import FileUpload from "./_components/FileUpload";
import { useState } from "react";

export default function Home() {
  noStore();

  const [result, setResult] = useState<string>("");

  const handleFileUpload = (result: string) => {
    setResult(result);
  };

  return (
    <div>
      <FileUpload onFileUpload={handleFileUpload} />
      <div>{result}</div>
    </div>
  );
}

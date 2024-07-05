"use client";

import { unstable_noStore as noStore } from "next/cache";
import FileUpload from "./_components/FileUpload";
import { useState } from "react";
import GeneratedTitles from "./_components/GeneratedTitles";

export default function Home() {
  noStore();

  const [result, setResult] = useState<string[]>([]);

  const handleFileUpload = (result: string[]) => {
    setResult(result);
  };

  return (
    <div>
      <FileUpload onFileUpload={handleFileUpload} />
      <GeneratedTitles titles={result} />
    </div>
  );
}

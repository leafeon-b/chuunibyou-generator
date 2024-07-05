"use client";

import { unstable_noStore as noStore } from "next/cache";
import SubmitForm from "./_components/SubmitForm";
import { useState } from "react";
import GeneratedTitles from "./_components/GeneratedTitles";

export default function Home() {
  noStore();

  const [result, setResult] = useState<string[]>([]);

  const handleSubmit = (result: string[]) => {
    setResult(result);
  };

  return (
    <div>
      <SubmitForm onSubmit={handleSubmit} />
      <GeneratedTitles titles={result} />
    </div>
  );
}

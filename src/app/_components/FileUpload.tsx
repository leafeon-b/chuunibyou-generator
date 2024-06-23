"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

interface FileUploadProps {
  onFileUpload: (result: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // const response = await fetch("/api/upload", {
    //   method: "POST",
    //   body: formData,
    // });

    // const data = await response.json();
    const data = { text: file.name };
    onFileUpload(data.text);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit" className="mt-2 rounded bg-blue-500 p-2 text-white">
        Upload
      </button>
    </form>
  );
};

export default FileUpload;

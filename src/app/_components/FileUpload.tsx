"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

interface FileUploadProps {
  onFileUpload: (result: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setError(null); // ファイルが変更されたらエラーメッセージをクリア
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 結果を返す前に2秒間待機
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // const response = await fetch("/api/upload", {
      //   method: "POST",
      //   body: formData,
      // });

      // const data = await response.json();
      const data = { text: file.name };
      onFileUpload(data.text);
    } catch (err) {
      setError("ファイルのアップロードに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded bg-blue-500 p-2 text-white"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default FileUpload;

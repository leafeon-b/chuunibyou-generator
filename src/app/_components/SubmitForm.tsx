"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import { generateText } from "../lib/actions";

interface SubmitFormProps {
  onSubmit: (result: string[]) => void;
}

const SubmitForm: React.FC<SubmitFormProps> = ({ onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
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
      if (!file) return;
      const response = await generateText(formData);
      console.log(`response`, response);

      onSubmit(response);
    } catch (err) {
      console.log(err);
      setError("リクエストの送信に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <div className="relative h-40 w-40">
            <Image
              src={preview}
              alt="プレビューの表示"
              layout="fill"
              objectFit="contain"
            />
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded bg-blue-500 p-2 text-white"
      >
        {loading ? "生成中..." : "タイトルを生成する"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default SubmitForm;

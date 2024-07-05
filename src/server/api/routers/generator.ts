import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { makePrompt } from "~/app/lib/promptMaker";

interface Titles {
  titles: string[];
}

const MAX_IMAGE_SIZE = 10; // 5MB

const generativeAI = new GoogleGenerativeAI(process.env.API_KEY ?? "");

// バイト単位のサイズをメガバイト単位に変換する
const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const fileSchema = z.object({
  file: z
    // z.inferでSchemaを定義したときに型がつくようにするため
    .custom<File>()
    // ファイルサイズを制限したい場合
    .refine((file) => sizeInMB(file?.size ?? 0) <= MAX_IMAGE_SIZE, {
      message: "ファイルサイズは最大10MBです",
    }),
});

export const generatorRouter = createTRPCRouter({
  // 画像ファイルを受け取りテキストデータを返す
  generate: publicProcedure.input(fileSchema).query(async ({ input }) => {
    console.log("generate", input.file.name, sizeInMB(input.file.size));
    // アップロードされた画像ファイルを使ってテキストデータを生成
    const model = generativeAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const prompt = makePrompt({ role: "モブ" });
    const imageParts: Part[] = [
      {
        inlineData: {
          data: Buffer.from(await input.file.arrayBuffer()).toString("base64"),
          mimeType: input.file.type,
        },
      },
    ];
    const result = (
      await model.generateContent([prompt, ...imageParts])
    ).response.text();
    console.log(`result: ${result}`);
    // result.response.text()で生成されたテキストデータからtitleを取り出す
    try {
      const resultJson: Titles = JSON.parse(result) as Titles;
      if (
        !resultJson.titles ||
        !Array.isArray(resultJson.titles) ||
        resultJson.titles.length === 0
      ) {
        throw new Error("タイトルの取得に失敗しました");
      }
      return resultJson.titles;
    } catch (err) {
      console.error(err);
      throw new Error("タイトルの取得に失敗しました");
    }
  }),
});

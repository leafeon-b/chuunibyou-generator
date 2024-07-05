import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { GoogleGenerativeAI, type Part } from "@google/generative-ai";

interface Titles {
  titles: string[];
}

const MAX_IMAGE_SIZE = 5; // 5MB

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
      message: "ファイルサイズは最大5MBです",
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
    const prompt = `この画像にタイトルをつけて欲しいです。タイトルの候補を3つ挙げてください。ただし以下の条件を守ってください。
- 厨二病的、あるいはなろう系な発想に基づくもの。この条件が一番重要
- 主に日本語
- 10文字以内
- 難しい漢字を使う場合はカタカナ英語の読み仮名をつけ、後ろに括弧で読み方を記載すること。ただし1つの候補につき1回のみとする
例を以下に示します。
- とある魔術の禁書目録(インデックス)
- ロクでなし魔術講師と禁忌教典(アカシックレコード)
- 風の聖痕(スティグマ)
基本的には、\'[連体修飾語][当て字の漢字](読み方)\'のようなものが多いです。
答える際は、この後分析しやすいように以下のような形式でお願いします。
{
  "titles": [
    "タイトル1",
    "タイトル2",
    "タイトル3"
  ]
}
`;
    const imageParts: Part[] = [
      {
        inlineData: {
          data: Buffer.from(await input.file.arrayBuffer()).toString("base64"),
          mimeType: input.file.type,
        },
      },
    ];
    const result = await model.generateContent([prompt, ...imageParts]);
    // result.response.text()で生成されたテキストデータからtitleを取り出す
    const resultJson: Titles = JSON.parse(result.response.text()) as Titles;
    return resultJson.titles;
  }),
});

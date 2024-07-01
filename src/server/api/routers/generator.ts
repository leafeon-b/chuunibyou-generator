import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const MAX_IMAGE_SIZE = 5; // 5MB

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
  generate: publicProcedure.input(fileSchema).query(({ input }) => {
    return {
      text: `name: ${input.file.name}`,
    };
  }),
});

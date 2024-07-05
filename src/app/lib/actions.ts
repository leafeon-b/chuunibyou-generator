"use server";

import { api } from "~/trpc/server";

export async function generateText(formData: FormData): Promise<string> {
  if (formData instanceof FormData) {
    const file = formData.get("file");
    if (file instanceof File) {
      return await api.generator.generate({ file });
    }
  }
  throw new Error("Invalid form data");
}

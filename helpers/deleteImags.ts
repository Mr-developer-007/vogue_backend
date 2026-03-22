import path from "node:path";
import fs from "fs";

export const deleteImage = async (filePath: string): Promise<void> => {
  try {
    const fullPath = path.join(process.cwd(), filePath);

    await fs.promises.unlink(fullPath);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

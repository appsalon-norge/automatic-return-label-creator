import { writeFile } from "fs";
import GetDataDir from "./getDataDir";
const saveLabel = async (id: string, data: Buffer) => {
  console.log("Saving label with ID:", id);
  const DATA_DIR = GetDataDir();
  const filename = `label-${id}.pdf`;
  const fullPath = `${DATA_DIR}/${filename}`;
  console.log("Full path for saving label:", fullPath);
  try {
    writeFile(fullPath, data, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        throw err;
      }
      console.log("File saved successfully:", fullPath);
    });
    return { success: true };
  } catch (error) {
    console.error("Error in saveLabel:", error);
    return { success: false, error };
  }
};
export default saveLabel;

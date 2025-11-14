import { writeFile } from "fs";
import GetDataDir from "./getDataDir";
/**
 * Saves a label PDF file to the local filesystem.
 * @param id - The ID of the consignment.
 * @param data - The PDF data to save.
 * @returns A Promise that resolves to an object indicating success or failure.
 */
const saveLabel = async (id: string, data: Buffer) => {
  console.log("Saving label with ID:", id);
  //gets the data directory where we save the labels
  const DATA_DIR = GetDataDir();
  //constructs the full path for the file + the name of the file
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

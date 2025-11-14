import fs from "fs";
import path from "path";
/**
 * Gets the data directory path, using environment variables.
 * @returns {string} The data directory path.
 */
const GetDataDir = (): string => {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (fs.existsSync("/data")) return "/data";
  return path.join(process.cwd(), "data");
};

export default GetDataDir;

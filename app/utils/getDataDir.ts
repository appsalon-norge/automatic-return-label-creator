import fs from "fs";
import path from "path";
const GetDataDir = () => {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (fs.existsSync("/data")) return "/data";
  return path.join(process.cwd(), "data");
};

export default GetDataDir;

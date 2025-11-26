// app/utils/returnAddressStorage.ts
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import GetDataDir from "./getDataDir";

export type ReturnAddressConfig = {
  name?: string;
  address1?: string;
  postcode?: string;
  city?: string;
  country?: string;
  email?: string;
  mobile?: string;
};

const FILE_NAME = "return-address.json";

function getConfigPath() {
  const dataDir = GetDataDir();
  return path.join(dataDir, FILE_NAME);
}

// Async read for route loader
export async function readReturnAddress(): Promise<ReturnAddressConfig | null> {
  try {
    const filePath = getConfigPath();
    const raw = await fsPromises.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return null;
    }
    console.error("Failed to read return address config", err);
    return null;
  }
}

// Async write for route action
export async function writeReturnAddress(
  config: ReturnAddressConfig,
): Promise<void> {
  const filePath = getConfigPath();
  await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
  await fsPromises.writeFile(filePath, JSON.stringify(config, null, 2), "utf8");
  console.log("[returnAddress] saved config to", filePath, config);
}

// Sync read for webhook / consignments
export function readReturnAddressSync(): ReturnAddressConfig | null {
  try {
    const filePath = getConfigPath();
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read return address config (sync)", err);
    return null;
  }
}

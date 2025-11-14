import saveLabel from "../utils/saveLabel";
import { test, expect } from "vitest";
import fs from "fs";
import path from "path";
import GetDataDir from "../utils/getDataDir";

const DATA_DIR = GetDataDir();

test("saveLabel saves a label file", async () => {
  const samplePdfBuffer = Buffer.from(
    "%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF",
    "utf-8",
  );
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const response = await saveLabel("1234", samplePdfBuffer);
  console.log(response);
  expect(response).toHaveProperty("success", true);
});

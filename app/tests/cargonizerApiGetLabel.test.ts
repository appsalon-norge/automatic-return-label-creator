import getCargonizerLabel from "../utils/cargonizerApiGetLabel";
import { test, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./msw/server";
import fs from "fs";
import path from "path";
import { readFile } from "fs/promises";
import GetDataDir from "../utils/getDataDir";

test("Cargonizer API Get Label mock test", async () => {
  const DATA_DIR = GetDataDir();
  const filename = `label-12345.pdf`;
  const fullPath = path.join(DATA_DIR, filename);
  const data = await readFile(fullPath, "utf8");

  const url = "https://www.vg.no/sample-label-url";
  server.use(
    http.get(url, () => {
      return HttpResponse.text(data, {
        headers: { "Content-Type": "application/pdf" },
      });
    }),
  );

  const blob = await getCargonizerLabel(url);
  console.log(blob);
  expect(blob).not.toBeNull();
});

import { LoaderFunctionArgs, useParams } from "react-router";
import path from "path";
import fs from "fs";
import { readFile } from "fs/promises";
import GetDataDir from "app/utils/getDataDir";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id;
  if (!id) {
    return new Response("ID parameter is missing", { status: 400 });
  }
  const DATA_DIR = GetDataDir();
  try {
    const filename = `label-${id}.pdf`;
    const fullPath = path.join(DATA_DIR, filename);
    const data = await readFile(fullPath, "utf8");

    return new Response(data, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new Response("File not found", { status: 404 });
  }
};

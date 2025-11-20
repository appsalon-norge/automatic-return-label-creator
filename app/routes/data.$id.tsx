// app/routes/data.$id.tsx
import type { LoaderFunctionArgs } from "react-router";
import fs from "fs/promises";
import path from "path";
import GetDataDir from "app/utils/getDataDir";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const dataDir = GetDataDir();
  const filename = `label-${id}.pdf`;
  const fullPath = path.join(dataDir, filename);

  console.log("Serving label:", fullPath);

  try {
    const fileBuffer = await fs.readFile(fullPath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        // inline = vis i nettleser. Bruk "attachment" hvis du vil tvinge nedlasting
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Error reading label file:", fullPath, error);

    if (error?.code === "ENOENT") {
      return new Response("Label not found", { status: 404 });
    }

    return new Response("Error reading label", { status: 500 });
  }
}

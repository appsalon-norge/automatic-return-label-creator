import prepareLabels from "../utils/prepareLabels";
import { test, expect, beforeAll } from "vitest";
import mockData from "./mockdata/consignmentPostXml";
import consignmentResponseXml from "./mockdata/consignmentResponsexml";
import parseConsignmentsXml from "../utils/parseConsignmentsXml";
import { http, HttpResponse } from "msw";
import { server } from "./msw/server";
import "./msw/setup"; // start MSW

// Hardcode single URL (including query) for label PDF fetch.
// The prepareLabels code will request consignment-pdf from parsed consignments mock;
// ensure that mock uses this exact URL if needed.
beforeAll(() => {
  server.use(
    http.get(
      "https://sandbox.cargonizer.no/consignments/label_pdf?consignment_ids%5B%5D=79758f",
      ({ request }) => {
        // Only respond if exact query matches ?consignment_ids[]=79758

        const pdfBytes = new Uint8Array([
          0x25, 0x50, 0x44, 0x46, 0x2d, 0x46, 0x41, 0x4b, 0x45, 0x0a,
        ]);
        return new HttpResponse(pdfBytes, {
          status: 200,
          headers: { "Content-Type": "application/pdf" },
        });
      },
    ),
  );
});

test("prepare labels function", async () => {
  const response = parseConsignmentsXml(consignmentResponseXml);
  const prepared = await prepareLabels(response, mockData);
  console.log("Prepared labels:", prepared);
  expect(Array.isArray(prepared)).toBe(true);
});

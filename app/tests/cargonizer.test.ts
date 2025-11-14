import "./msw/setup"; // ensure server.listen lifecycle hooks run
import buildConsignments from "../utils/postConsignments";
import { expect, test, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./msw/server";
import consignmentResponseXml from "./mockdata/consignmentResponsexml";
import cargonizerApi from "../utils/cargonizerApi";
import mockData from "./mockdata/consignmentPostXml";

beforeEach(() => {
  // Set env vars needed for URL + headers (can be moved to global setup if reused)
  process.env.LOGISTRA_BASE_URL = "https://cargonizer.test/";
  process.env.LOGISTRA_API_KEY = "test-key";
  process.env.LOGISTRA_SENDER_ID = "test-sender";
});
test("buildConsignments produces correct XML", () => {
  expect(buildConsignments(mockData).xml).toContain("<consignment");
  expect(buildConsignments(mockData).xml).toContain("Test Product");
  expect(buildConsignments(mockData).xml).toContain("John Doe");
});

test("Cargonizer API mock test", async () => {
  server.use(
    http.post(process.env.LOGISTRA_BASE_URL + "consignments.xml", () => {
      return HttpResponse.xml(consignmentResponseXml, {
        headers: { "Content-Type": "application/xml" },
      });
    }),
  );
  const parsed = await cargonizerApi(mockData);
  expect(parsed.consignments.length).toBeGreaterThan(0);
  for (const consignment of parsed.consignments) {
    // Each consignment element will have child elements; ID is inside <id> element, not attribute.
    // Depending on fast-xml-parser config, it could be accessible as consignment.id or array.
    const idNode = consignment.id;
    console.log(
      "Consignment ID:",
      typeof idNode === "object" ? idNode : idNode,
    );
  }
  expect(parsed.json.consignments).toBeDefined();
});

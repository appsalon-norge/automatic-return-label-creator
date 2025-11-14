import "./msw/setup"; // ensure server.listen lifecycle hooks run
import { buildConsignmentsXml } from "../utils/postConsignments";
import { expect, test, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./msw/server";
import consignmentResponseXml from "./mockdata/consignmentResponsexml";
import cargonizerApi from "../utils/cargonizerApi";
import mockData from "./mockdata/consignmentPostXml";

beforeEach(() => {
  // Set env vars needed for URL + headers (can be moved to global setup if reused)
  process.env.base_url = "https://cargonizer.test/";
  process.env.api_key = "test-key";
  process.env.sender_id = "test-sender";
});
test("buildConsignmentsXml produces correct XML", () => {
  expect(buildConsignmentsXml(mockData).xml).toContain("<consignment");
  expect(buildConsignmentsXml(mockData).xml).toContain("Test Product");
  expect(buildConsignmentsXml(mockData).xml).toContain("John Doe");
});

test("Cargonizer API mock test", async () => {
  server.use(
    http.post(process.env.base_url + "consignments.xml", () => {
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

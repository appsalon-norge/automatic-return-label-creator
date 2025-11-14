import { XMLParser } from "fast-xml-parser";

export interface ParsedConsignmentResponse<T = any> {
  raw: string;
  json: T;
  consignments: any[]; // normalized list of consignments
}

/**
 * Parse a Cargonizer consignments XML response and always return an array of consignments.
 * Handles the single-element case where fast-xml-parser would otherwise return an object.
 */
export function parseConsignmentsXml(xml: string): ParsedConsignmentResponse {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const json = parser.parse(xml);
  // Expect structure: { consignments: { consignment: [...] }} OR single object
  const root = json?.consignments;
  let consignments: any[] = [];
  if (root) {
    const c = root.consignment;
    if (Array.isArray(c)) consignments = c;
    else if (c) consignments = [c];
  }
  console.log(xml);
  return { raw: xml, json, consignments };
}

export default parseConsignmentsXml;

import parseConsignmentsXml, {
  ParsedConsignmentResponse,
} from "./parseConsignmentsXml";
/**
 * POST consignments XML to Cargonizer API.
 * Returns the Response object (mocked in tests) instead of always null.
 */
const cargonizerApi = async (
  xml: string,
): Promise<ParsedConsignmentResponse> => {
  const rawBase = process.env.base_url;
  if (!rawBase) {
    throw new Error(
      "cargonizerApi: process.env.base_url is not set. Set it in your environment or test setup.",
    );
  }
  // Normalize base URL to ensure single trailing slash before path.
  const baseUrl = rawBase.endsWith("/") ? rawBase : rawBase + "/";
  const fullUrl = baseUrl + "consignments.xml";

  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/xml",
      Accept: "application/xml",
      "X-Cargonizer-Key": process.env.api_key || "",
      "X-Cargonizer-Sender": process.env.sender_id || "",
    },
    body: xml,
  });
  const body = await response.text();
  return parseConsignmentsXml(body);
};

export default cargonizerApi;

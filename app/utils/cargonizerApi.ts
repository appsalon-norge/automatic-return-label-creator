import parseConsignmentsXml, {
  ParsedConsignmentResponse,
} from "./parseConsignmentsXml";
/**
 *
 * @param xml - Xml string that is used for POST to Cargonizer API.
 * @returns {object} ParsedConsignmentResponse containing raw XML, JSON object, and array of consignments.
 */
const cargonizerApi = async (
  xml: string,
): Promise<ParsedConsignmentResponse> => {
  //base url for cargonizer api, this is differnet based on sanbox or production
  //in producion, it is api.cargonizer.no, for sandbox it is sandbox.cargonizer.no
  const rawBase = process.env.LOGISTRA_BASE_URL || process.env.base_url;
  if (!rawBase) {
    throw new Error(
      "cargonizerApi: LOGISTRA_BASE_URL is not set. Set it in your environment or test setup.",
    );
  }
  // Normalize base URL to ensure single trailing slash before path.
  const baseUrl = rawBase.endsWith("/") ? rawBase : rawBase + "/";
  const fullUrl = baseUrl + "consignments.xml";

  //sends POST request to the api, gets in return all or one consignment that should be used for labels
  //if any information is wrong, the xml will return a list of all the errors
  //see information at https://github.com/logistra/cargonizer-documentation/wiki/Consignments
  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/xml",
      Accept: "application/xml",
      "X-Cargonizer-Key":
        process.env.LOGISTRA_API_KEY || process.env.api_key || "",
      "X-Cargonizer-Sender":
        process.env.LOGISTRA_SENDER_ID || process.env.sender_id || "",
    },
    body: xml,
  });
  const body = await response.text();

  //sends the data to be parsed by XML parser
  return parseConsignmentsXml(body);
};

export default cargonizerApi;

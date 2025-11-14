import parseConsignmentsXml, {
  ParsedConsignmentResponse,
} from "./parseConsignmentsXml";
/**
 *
 * @param url - The URL of the Cargonizer label PDF to fetch.
 * @returns A Promise that resolves to a Blob containing the PDF data, or null if the fetch fails.
 */
const getCargonizerLabel = async (url: string) => {
  if (!url) {
    return null;
  }
  //needs to be authenticated with the same headers as cargonizer api (the other file)
  // X-Cargonizer-Key and X-Cargonizer-Sender, from environment variables.
  //this can be found using postman, or seen in the cargonizer connect app
  const response = await fetch(url, {
    headers: {
      Accept: "application/pdf",
      "X-Cargonizer-Key":
        process.env.LOGISTRA_API_KEY || process.env.api_key || "",
      "X-Cargonizer-Sender":
        process.env.LOGISTRA_SENDER_ID || process.env.sender_id || "",
    },
  });
  console.log(response);
  console.log(response.status);
  if (response.ok) {
    const blob = await response.blob();
    return blob;
  }
  return null;
};

export default getCargonizerLabel;

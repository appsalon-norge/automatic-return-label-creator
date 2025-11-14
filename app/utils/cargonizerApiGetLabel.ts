import parseConsignmentsXml, {
  ParsedConsignmentResponse,
} from "./parseConsignmentsXml";

const getCargonizerLabel = async (url: string) => {
  if (!url) {
    return null;
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/pdf",
      "X-Cargonizer-Key": process.env.api_key || "",
      "X-Cargonizer-Sender": process.env.sender_id || "",
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

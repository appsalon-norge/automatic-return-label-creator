import { ReturnApproveRequestMutation } from "app/types/admin.generated";
import getCargonizerLabel from "./cargonizerApiGetLabel";
import saveLabel from "./saveLabel";
import GetDataDir from "./getDataDir";

export type PreparedLabel = {
  reverseFulfillmentOrderId: string | undefined;
  notifyCustomer: boolean;
  labelInput: { fileUrl: string };
  reverseDeliveryLineItems: { id: string | undefined; quantity: number }[];
};

const prepareLabels = async (
  allConsignments: any,
  returnData: ReturnApproveRequestMutation,
): Promise<PreparedLabel[]> => {
  console.log(allConsignments);
  console.log(returnData);
  const { consignments } = allConsignments;
  const preparedLabelsPromises = consignments.map(async (consignment: any) => {
    const matched =
      returnData.returnApproveRequest?.return?.reverseFulfillmentOrders.edges.find(
        (rfoEdge) => {
          return (
            rfoEdge?.node?.id ===
            consignment.values.value.find(
              (v: any) => v["@_name"] === "reversefulfillmentorders",
            )["@_value"]
          );
        },
      );

    console.log(matched);
    if (!matched) {
      return null;
    }
    const preparedLabel = await getCargonizerLabel(
      // consignment-pdf may be plain string or object with '#text'
      (() => {
        const rawPdf = consignment["consignment-pdf"];
        if (rawPdf && typeof rawPdf === "object" && "#text" in rawPdf) {
          return String(rawPdf["#text"]);
        }
        return String(rawPdf);
      })(),
    );
    if (!preparedLabel) {
      return null;
    }
    const labelArrayBuffer = await preparedLabel.arrayBuffer();
    const labelBuffer = Buffer.from(labelArrayBuffer);
    // Consignment id may be an object like { '#text': 79758, '@_type': 'integer' }
    const rawId = consignment["id"];
    const consignmentId =
      rawId && typeof rawId === "object" && "#text" in rawId
        ? String(rawId["#text"])
        : String(rawId);
    const saveResponse = await saveLabel(consignmentId, labelBuffer);
    if (saveResponse.error) {
      return null;
    }
    const ROUTE_TO_PDF =
      process.env.ROUTE_TO_PDF || "http://localhost:3000/data";
    const fileUrl = ROUTE_TO_PDF + `${consignmentId}`;
    return {
      reverseFulfillmentOrderId: matched?.node?.id,
      notifyCustomer: true,
      labelInput: {
        fileUrl: fileUrl,
      },
      reverseDeliveryLineItems: matched.node.lineItems.edges.map((liEdge) => {
        // GraphQL mutation expects reverseFulfillmentOrderLineItemId, not fulfillmentLineItem id or nested line item id.
        // The edge node itself represents ReverseFulfillmentOrderLineItem, so we use its id.
        return {
          id: liEdge?.node?.id,
          quantity: liEdge?.node?.totalQuantity ?? 0,
        };
      }),
    };
  });
  // Resolve all label preparations and filter out nulls (unmatched or failed saves)
  const resolved = await Promise.all(preparedLabelsPromises);
  return resolved.filter((pl): pl is PreparedLabel => pl !== null);
};

export default prepareLabels;

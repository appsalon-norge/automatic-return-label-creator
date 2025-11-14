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
/**
 *
 * @param allConsignments a list of all the consignments for this return
 * @param returnData the return data from the accept return mutation, we use this to match up the rfo ids so each consignment has the correct label (if there are more)
 * @returns list of labels that can be sent to shopify
 */
const prepareLabels = async (
  allConsignments: any,
  returnData: ReturnApproveRequestMutation,
): Promise<PreparedLabel[]> => {
  console.log(allConsignments);
  console.log(returnData);
  const { consignments } = allConsignments;

  //we match each consignment to the correct rfo by looking at the reversefulfillmentorders value in the consignment values
  //the reversefulfillmentorders value is set when building the consignments xml to match response from cargonizer to the rfo in shopify
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
    //if for some reason it does not match, we skip this consignment
    if (!matched) {
      return null;
    }

    //we download the label from cargonizer, as we  can not access the url directly without authentication
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

    //prepare for saving the label locally
    const labelArrayBuffer = await preparedLabel.arrayBuffer();
    const labelBuffer = Buffer.from(labelArrayBuffer);
    // Consignment id may be an object like { '#text': 79758, '@_type': 'integer' }
    const rawId = consignment["id"];
    const consignmentId =
      rawId && typeof rawId === "object" && "#text" in rawId
        ? String(rawId["#text"])
        : String(rawId);
    //send to save label function, which saves the label in the data folder. with the name label-{{consignmentId}}.pdf
    const saveResponse = await saveLabel(consignmentId, labelBuffer);
    if (saveResponse.error) {
      return null;
    }

    //this secret should be the app url + /app/label/
    const ROUTE_TO_PDF =
      process.env.ROUTE_TO_PDF || "http://localhost:3000/data";
    //this will be the full url we will send to shopify, including the id, but not file name
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

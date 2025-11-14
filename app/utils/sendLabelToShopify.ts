import { reverseDeliveriesCreateWithShipping } from "../graphql/reverseDeliveryCreateWithShipping";
import { ReverseFulfillmentOrder } from "app/types/admin.types";
interface PreparedLabelRaw {
  reverseFulfillmentOrderId: string; // expected to be a GID like gid://shopify/ReverseFulfillmentOrder/123
  notifyCustomer: boolean;
  labelInput?: {
    fileUrl: string;
  };
  reverseDeliveryLineItems: {
    id: string; // currently fulfillmentLineItem id from prepareLabels
    quantity: number;
  }[];
}

// Transformed payload matching mutation variable names & required shape
interface ReverseDeliveryMutationInput {
  reverseFulfillmentOrderId: string;
  notifyCustomer: boolean;
  labelInput?: {
    fileUrl: string;
  };
  reverseDeliveryLineItems: {
    reverseFulfillmentOrderLineItemId: string;
    quantity: number;
  }[];
}
const normalizeRfoId = (id: string) => {
  // If already a global ID (starts with gid://) return as-is; else attempt to extract numeric tail or leave original.
  if (!id) throw new Error("reverseFulfillmentOrderId missing");
  if (id.startsWith("gid://")) return id;
  // Accept numeric or UUID parts and build a GID if pattern matches digits only.
  const numeric = id.match(/(\d+)$/)?.[1];
  if (numeric) return `gid://shopify/ReverseFulfillmentOrder/${numeric}`;
  return id; // fallback - may still error if not valid
};

const transformLabel = (
  raw: PreparedLabelRaw,
): ReverseDeliveryMutationInput => {
  return {
    reverseFulfillmentOrderId: normalizeRfoId(raw.reverseFulfillmentOrderId),
    notifyCustomer: raw.notifyCustomer,
    labelInput: raw.labelInput,
    reverseDeliveryLineItems: raw.reverseDeliveryLineItems.map((li) => ({
      reverseFulfillmentOrderLineItemId: li.id, // map to expected field name
      quantity: li.quantity,
    })),
  };
};

const sendLabelToShopify = async (preparedLabels: any[], graphql: any) => {
  const successfulSends = [];
  for (const rawLabel of preparedLabels) {
    try {
      const input = transformLabel(rawLabel);
      const response = await graphql(reverseDeliveriesCreateWithShipping, {
        variables: input,
      });
      const { data } = await response.json();
      if (data.reverseDeliveryCreateWithShipping.userErrors.length === 0) {
        console.log(
          `Successfully sent label for RFO ${input.reverseFulfillmentOrderId}`,
        );
        successfulSends.push(input.reverseFulfillmentOrderId);
      } else {
        console.error(
          `User errors while sending label for RFO ${input.reverseFulfillmentOrderId}:`,
          data.reverseDeliveryCreateWithShipping.userErrors,
        );
      }
    } catch (error) {
      console.error(
        `Error sending label for RFO ${rawLabel.reverseFulfillmentOrderId}:`,
        error,
      );
    }
  }
  return successfulSends;
};
export default sendLabelToShopify;

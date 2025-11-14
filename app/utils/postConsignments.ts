import { ReturnApproveRequestMutation } from "app/types/admin.generated";
import { XMLBuilder } from "fast-xml-parser";

interface BuiltConsignmentsXml {
  consignments: any[]; // JS objects representing each consignment
  xml: string; // final XML string
}

// Minimal helper to safely stringify values (fast-xml-parser will escape as needed)
const val = (value: unknown): string => (value == null ? "" : String(value));

export const buildConsignmentsXml = (
  graphqlData: ReturnApproveRequestMutation,
): BuiltConsignmentsXml => {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    suppressBooleanAttributes: false,
    format: true,
  });

  const rfoEdges =
    graphqlData.returnApproveRequest?.return?.reverseFulfillmentOrders.edges ||
    [];

  const consignmentsObjects = rfoEdges
    .map((edge) => {
      console.log(edge.node.order?.shippingAddress);
      const rfo = edge?.node;
      if (!rfo) return null;
      const orderName = rfo.order?.name || "";
      const customerDisplayName = rfo.order?.customer?.displayName || "";
      const transportAgreement = process.env.transport_agreement_id || "1357";

      // Build items according to required XML shape:
      // <items><item type="package" amount="1" volume="3" description="Something"/></items>
      // Do NOT include weight.
      const items = (rfo.lineItems?.edges || [])
        .map((liEdge) => {
          const li = liEdge?.node;
          if (!li) return null;
          const name = li.fulfillmentLineItem?.lineItem?.name || "Item";
          const amount = li.totalQuantity ?? 1; // fallback if totalQuantity not present in mock/query
          return {
            item: {
              "@_type": "package",
              "@_amount": amount,
              "@_description": `Retur ${name}`,
            },
          };
        })
        .filter(Boolean) as any[];

      return {
        consignment: {
          "@_transport_agreement": transportAgreement,
          email_label_to_consignee: true,
          product: "bring2_return_pickup_point",
          parts: {
            consignee: {
              name: val(rfo.order?.shippingAddress?.name),
              address1: val(rfo.order?.billingAddress?.address1),
              postcode: val(rfo.order?.billingAddress?.zip),
              city: val(rfo.order?.billingAddress?.city),
              country: "NO",
              email: val(
                rfo.order?.customer?.defaultEmailAddress?.emailAddress,
              ),
              mobile: val(rfo.order?.billingAddress?.phone),
            },
            return_addres: {
              name: val(process.env.RETURN_ADDRESS_NAME || "Din Butikk AS"),
              address1: val(
                process.env.RETURN_ADDRESS_ADDRESS1 || "Butikkgata 2",
              ),
              address2: val(
                process.env.RETURN_ADDRESS_ADDRESS2 || "v/ Returavdeling",
              ),
              postcode: val(process.env.RETURN_ADDRESS_POSTCODE || "0150"),
              city: val(process.env.RETURN_ADDRESS_CITY || "Oslo"),
              country: val(process.env.RETURN_ADDRESS_COUNTRY || "NO"),
              email: val(
                process.env.RETURN_ADDRESS_EMAIL || "support@dinbutikk.no",
              ),
              mobile: val(process.env.RETURN_ADDRESS_MOBILE || "97000000"),
            },
          },
          items: items,
          references: {
            consignor: `Order ${orderName}`,
            consignee: `Customer return from ${customerDisplayName}`,
            return_reference: `Shopify-${orderName}`,
          },
          values: {
            value: [
              { "@_name": "orderno", "@_value": orderName },
              // New required value: reversefulfillmentorders -> rfo id
              {
                "@_name": "reversefulfillmentorders",
                "@_value": val((rfo as any).id),
              },
            ],
          },
        },
      };
    })
    .filter(Boolean) as any[];

  // Builder expects a root object. If multiple consignments, consignments.consignment becomes an array.
  const xml = builder.build({ consignments: consignmentsObjects });
  console.log(xml);
  return { consignments: consignmentsObjects, xml };
};

const buildConsignments = async (
  graphqlData: ReturnApproveRequestMutation,
): Promise<BuiltConsignmentsXml> => {
  return buildConsignmentsXml(graphqlData);
};

export default buildConsignments;

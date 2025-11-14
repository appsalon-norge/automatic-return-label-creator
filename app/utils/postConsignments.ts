import { ReturnApproveRequestMutation } from "app/types/admin.generated";
import { XMLBuilder } from "fast-xml-parser";

export interface BuiltConsignmentsXml {
  consignments: any[]; // JS objects representing each consignment
  xml: string; // final XML string
}

// Minimal helper to safely stringify values (fast-xml-parser will escape as needed)
const val = (value: unknown): string => (value == null ? "" : String(value));

/**
 * Build Cargonizer consignments XML from a ReturnApproveRequestMutation GraphQL response.
 * Combines the previous two-step process (object build + wrapper) into a single function.
 *
 * Responsibilities:
 * - Extract reverse fulfillment orders (RFO) edges
 * - Map each RFO to a consignment object with required structure
 * - Inject environment-based return address
 * - Produce final XML string with <consignments> root
 *
 * @param graphqlData GraphQL data from ReturnApproveRequestMutation.
 * @returns {BuiltConsignmentsXml} Object list and XML string.
 */
const buildConsignments = (
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
      const rfo = edge?.node;
      if (!rfo) return null;
      const orderName = rfo.order?.name || "";
      const customerDisplayName = rfo.order?.customer?.displayName || "";
      const transportAgreement =
        process.env.LOGISTRA_TRANSPORT_AGREEMENT_ID ||
        process.env.transport_agreement_id ||
        "1357";

      const items = (rfo.lineItems?.edges || [])
        .map((liEdge) => {
          const li = liEdge?.node;
          if (!li) return null;
          const name = li.fulfillmentLineItem?.lineItem?.name || "Item";
          const amount = li.totalQuantity ?? 1;
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
            // For return products: consignee should represent the store (environment variables)
            consignee: {
              name: val(
                process.env.LOGISTRA_RETURN_ADDRESS_NAME ||
                  process.env.RETURN_ADDRESS_NAME ||
                  "Din Butikk AS",
              ),
              address1: val(
                process.env.LOGISTRA_RETURN_ADDRESS_ADDRESS1 ||
                  process.env.RETURN_ADDRESS_ADDRESS1 ||
                  "Butikkgata 2",
              ),
              address2: val(
                process.env.LOGISTRA_RETURN_ADDRESS_ADDRESS2 ||
                  process.env.RETURN_ADDRESS_ADDRESS2 ||
                  "v/ Returavdeling",
              ),
              postcode: val(
                process.env.LOGISTRA_RETURN_ADDRESS_POSTCODE ||
                  process.env.RETURN_ADDRESS_POSTCODE ||
                  "0150",
              ),
              city: val(
                process.env.LOGISTRA_RETURN_ADDRESS_CITY ||
                  process.env.RETURN_ADDRESS_CITY ||
                  "Oslo",
              ),
              country: val(
                process.env.LOGISTRA_RETURN_ADDRESS_COUNTRY ||
                  process.env.RETURN_ADDRESS_COUNTRY ||
                  "NO",
              ),
              email: val(
                process.env.LOGISTRA_RETURN_ADDRESS_EMAIL ||
                  process.env.RETURN_ADDRESS_EMAIL ||
                  "support@dinbutikk.no",
              ),
              mobile: val(
                process.env.LOGISTRA_RETURN_ADDRESS_MOBILE ||
                  process.env.RETURN_ADDRESS_MOBILE ||
                  "97000000",
              ),
            },
            // Return address now reflects the original order's customer shipping/billing details
            return_addres: {
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
          },
          items,
          references: {
            consignor: `Order ${orderName}`,
            consignee: `Customer return from ${customerDisplayName}`,
            return_reference: `Shopify-${orderName}`,
          },
          values: {
            value: [
              { "@_name": "orderno", "@_value": orderName },
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

  const xml = builder.build({ consignments: consignmentsObjects });
  return { consignments: consignmentsObjects, xml };
};

export default buildConsignments;

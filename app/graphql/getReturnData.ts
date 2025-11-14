// 2026-01 Admin GraphQL
export const GET_RETURN_DATA = `#graphql
query GetReturn(
  $id: ID!,
  $rfoCount: Int = 10,
  $rfoItemCount: Int = 50,
  $returnLineItemCount: Int = 25
) {
  return(id: $id) {
    id
    name
    status
    createdAt
    totalQuantity

    # Return-level line items (reasons, notes, etc.)
    returnLineItems(first: $returnLineItemCount) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          ... on ReturnLineItem {
            id
            quantity
            returnReason
            returnReasonNote
            fulfillmentLineItem {
              id
              lineItem { id name }
            }
            totalWeight { value }
          }
        }
      }
    }

    # Reverse Fulfillment Orders (logistics for the return)
    reverseFulfillmentOrders(first: $rfoCount) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          status
          lineItems(first: $rfoItemCount) {
            pageInfo { hasNextPage endCursor }
            edges {
              node {
                id
                totalQuantity
                fulfillmentLineItem {
                  id
                  lineItem { id name }
                }
                # Dispositions (e.g., RESTOCKED / PROCESSING_REQUIRED)
                dispositions {
                  type
                  quantity
                  location { id name }
                }
              }
            }
          }
          # Optional: deliveries (labels/shipments going back)
          reverseDeliveries(first: 10) {
            edges { node { id } }
          }
        }
      }
    }

    # Optional: exchange items related to this return
    exchangeLineItems(first: 10) {
      edges { node { id } }
    }
  }
}
`;

export const getReturnData = (id: string) => ({
  query: GET_RETURN_DATA,
  variables: { id },
});

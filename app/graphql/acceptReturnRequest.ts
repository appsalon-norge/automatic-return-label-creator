const acceptReturnRequest = `#graphql
mutation ReturnApproveRequest($input: ReturnApproveRequestInput!) {
  returnApproveRequest(input: $input) {
    return {
      id
      name
      status
      totalQuantity
      returnLineItems(first: 1) { edges { node { id } } }
      order { id name }
      reverseFulfillmentOrders(first: 10) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id
            status
            thirdPartyConfirmation { status }
            order {
              id
              name
              customer { id displayName defaultEmailAddress { emailAddress } }
              billingAddress { name address1 address2 city zip phone countryCodeV2 }
              shippingAddress { name address1 address2 city zip phone countryCodeV2 }
            }
            lineItems(first: 50) {
              pageInfo { hasNextPage endCursor }
              edges {
                node {
                  id
                  totalQuantity
                  fulfillmentLineItem { id lineItem { id name } }
                  dispositions {
                    id
                    createdAt
                    type
                    quantity
                    location { id name }
                  }
                }
              }
            }
            reverseDeliveries(first: 10) {
              edges {
                node {
                  id
                  deliverable {
                    ... on ReverseDeliveryShippingDeliverable {
                      label { publicFileUrl createdAt updatedAt }
                      tracking { carrierName number url }
                    }
                  }
                  reverseDeliveryLineItems(first: 50) {
                    edges {
                      node {
                        id
                        dispositions {
                          id
                          createdAt
                          type
                          quantity
                          location { id name }
                        }
                      }
                    }
                  } 
                }
              }
            }
          }
        }
      }
    }
    userErrors { code field message }
  }
}
`;
/**
 * Creates a GraphQL mutation for accepting a return request.
 * @param {string} id The Return (GID) identifier.
 * @param {boolean} [notifyCustomer=false] Whether to notify the customer about the status change.
 * @returns {{ query: string, variables: { input: { id: string, notifyCustomer: boolean } } }} GraphQL mutation string and variables payload.
 */
export const acceptReturnRequestMutation = (
  id: string,
  notifyCustomer: boolean = false,
) => ({
  query: acceptReturnRequest,
  variables: { input: { id, notifyCustomer } },
});

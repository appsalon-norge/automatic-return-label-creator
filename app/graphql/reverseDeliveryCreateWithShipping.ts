export const reverseDeliveriesCreateWithShipping = `#graphql
mutation reverseDeliveryCreateWithShipping($reverseFulfillmentOrderId: ID!, $reverseDeliveryLineItems: [ReverseDeliveryLineItemInput!]!, $trackingInput: ReverseDeliveryTrackingInput, $labelInput: ReverseDeliveryLabelInput, $notifyCustomer: Boolean) {
  reverseDeliveryCreateWithShipping(reverseFulfillmentOrderId: $reverseFulfillmentOrderId, reverseDeliveryLineItems: $reverseDeliveryLineItems, trackingInput: $trackingInput, labelInput: $labelInput, notifyCustomer: $notifyCustomer) {
    reverseDelivery {
        id
    }
    userErrors {
      field
      message
    }
  }
}
`;

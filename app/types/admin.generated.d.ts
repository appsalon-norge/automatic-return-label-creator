/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type ReturnApproveRequestMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.ReturnApproveRequestInput;
}>;


export type ReturnApproveRequestMutation = { returnApproveRequest?: AdminTypes.Maybe<{ return?: AdminTypes.Maybe<(
      Pick<AdminTypes.Return, 'id' | 'name' | 'status' | 'totalQuantity'>
      & { returnLineItems: { edges: Array<{ node: Pick<AdminTypes.ReturnLineItem, 'id'> | Pick<AdminTypes.UnverifiedReturnLineItem, 'id'> }> }, order: Pick<AdminTypes.Order, 'id' | 'name'>, reverseFulfillmentOrders: { pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'>, edges: Array<{ node: (
            Pick<AdminTypes.ReverseFulfillmentOrder, 'id' | 'status'>
            & { thirdPartyConfirmation?: AdminTypes.Maybe<Pick<AdminTypes.ReverseFulfillmentOrderThirdPartyConfirmation, 'status'>>, order?: AdminTypes.Maybe<(
              Pick<AdminTypes.Order, 'id' | 'name'>
              & { customer?: AdminTypes.Maybe<(
                Pick<AdminTypes.Customer, 'id' | 'displayName'>
                & { defaultEmailAddress?: AdminTypes.Maybe<Pick<AdminTypes.CustomerEmailAddress, 'emailAddress'>> }
              )>, billingAddress?: AdminTypes.Maybe<Pick<AdminTypes.MailingAddress, 'name' | 'address1' | 'address2' | 'city' | 'zip' | 'phone' | 'countryCodeV2'>>, shippingAddress?: AdminTypes.Maybe<Pick<AdminTypes.MailingAddress, 'name' | 'address1' | 'address2' | 'city' | 'zip' | 'phone' | 'countryCodeV2'>> }
            )>, lineItems: { pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'>, edges: Array<{ node: (
                  Pick<AdminTypes.ReverseFulfillmentOrderLineItem, 'id' | 'totalQuantity'>
                  & { fulfillmentLineItem?: AdminTypes.Maybe<(
                    Pick<AdminTypes.FulfillmentLineItem, 'id'>
                    & { lineItem: Pick<AdminTypes.LineItem, 'id' | 'name'> }
                  )>, dispositions: Array<(
                    Pick<AdminTypes.ReverseFulfillmentOrderDisposition, 'id' | 'createdAt' | 'type' | 'quantity'>
                    & { location?: AdminTypes.Maybe<Pick<AdminTypes.Location, 'id' | 'name'>> }
                  )> }
                ) }> }, reverseDeliveries: { edges: Array<{ node: (
                  Pick<AdminTypes.ReverseDelivery, 'id'>
                  & { deliverable?: AdminTypes.Maybe<{ label?: AdminTypes.Maybe<Pick<AdminTypes.ReverseDeliveryLabelV2, 'publicFileUrl' | 'createdAt' | 'updatedAt'>>, tracking?: AdminTypes.Maybe<Pick<AdminTypes.ReverseDeliveryTrackingV2, 'carrierName' | 'number' | 'url'>> }>, reverseDeliveryLineItems: { edges: Array<{ node: (
                        Pick<AdminTypes.ReverseDeliveryLineItem, 'id'>
                        & { dispositions: Array<(
                          Pick<AdminTypes.ReverseFulfillmentOrderDisposition, 'id' | 'createdAt' | 'type' | 'quantity'>
                          & { location?: AdminTypes.Maybe<Pick<AdminTypes.Location, 'id' | 'name'>> }
                        )> }
                      ) }> } }
                ) }> } }
          ) }> } }
    )>, userErrors: Array<Pick<AdminTypes.ReturnUserError, 'code' | 'field' | 'message'>> }> };

export type GetReturnQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  rfoCount?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  rfoItemCount?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  returnLineItemCount?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
}>;


export type GetReturnQuery = { return?: AdminTypes.Maybe<(
    Pick<AdminTypes.Return, 'id' | 'name' | 'status' | 'createdAt' | 'totalQuantity'>
    & { returnLineItems: { pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'>, edges: Array<{ node: (
          Pick<AdminTypes.ReturnLineItem, 'id' | 'quantity' | 'returnReason' | 'returnReasonNote'>
          & { fulfillmentLineItem: (
            Pick<AdminTypes.FulfillmentLineItem, 'id'>
            & { lineItem: Pick<AdminTypes.LineItem, 'id' | 'name'> }
          ), totalWeight?: AdminTypes.Maybe<Pick<AdminTypes.Weight, 'value'>> }
        ) }> }, reverseFulfillmentOrders: { pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'>, edges: Array<{ node: (
          Pick<AdminTypes.ReverseFulfillmentOrder, 'id' | 'status'>
          & { lineItems: { pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'>, edges: Array<{ node: (
                Pick<AdminTypes.ReverseFulfillmentOrderLineItem, 'id' | 'totalQuantity'>
                & { fulfillmentLineItem?: AdminTypes.Maybe<(
                  Pick<AdminTypes.FulfillmentLineItem, 'id'>
                  & { lineItem: Pick<AdminTypes.LineItem, 'id' | 'name'> }
                )>, dispositions: Array<(
                  Pick<AdminTypes.ReverseFulfillmentOrderDisposition, 'type' | 'quantity'>
                  & { location?: AdminTypes.Maybe<Pick<AdminTypes.Location, 'id' | 'name'>> }
                )> }
              ) }> }, reverseDeliveries: { edges: Array<{ node: Pick<AdminTypes.ReverseDelivery, 'id'> }> } }
        ) }> }, exchangeLineItems: { edges: Array<{ node: Pick<AdminTypes.ExchangeLineItem, 'id'> }> } }
  )> };

export type ReverseDeliveryCreateWithShippingMutationVariables = AdminTypes.Exact<{
  reverseFulfillmentOrderId: AdminTypes.Scalars['ID']['input'];
  reverseDeliveryLineItems: Array<AdminTypes.ReverseDeliveryLineItemInput> | AdminTypes.ReverseDeliveryLineItemInput;
  trackingInput?: AdminTypes.InputMaybe<AdminTypes.ReverseDeliveryTrackingInput>;
  labelInput?: AdminTypes.InputMaybe<AdminTypes.ReverseDeliveryLabelInput>;
  notifyCustomer?: AdminTypes.InputMaybe<AdminTypes.Scalars['Boolean']['input']>;
}>;


export type ReverseDeliveryCreateWithShippingMutation = { reverseDeliveryCreateWithShipping?: AdminTypes.Maybe<{ reverseDelivery?: AdminTypes.Maybe<Pick<AdminTypes.ReverseDelivery, 'id'>>, userErrors: Array<Pick<AdminTypes.ReturnUserError, 'field' | 'message'>> }> };

export type PopulateProductMutationVariables = AdminTypes.Exact<{
  product: AdminTypes.ProductCreateInput;
}>;


export type PopulateProductMutation = { productCreate?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<(
      Pick<AdminTypes.Product, 'id' | 'title' | 'handle' | 'status'>
      & { variants: { edges: Array<{ node: Pick<AdminTypes.ProductVariant, 'id' | 'price' | 'barcode' | 'createdAt'> }> } }
    )> }> };

export type ShopifyReactRouterTemplateUpdateVariantMutationVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
  variants: Array<AdminTypes.ProductVariantsBulkInput> | AdminTypes.ProductVariantsBulkInput;
}>;


export type ShopifyReactRouterTemplateUpdateVariantMutation = { productVariantsBulkUpdate?: AdminTypes.Maybe<{ productVariants?: AdminTypes.Maybe<Array<Pick<AdminTypes.ProductVariant, 'id' | 'price' | 'barcode' | 'createdAt'>>> }> };

interface GeneratedQueryTypes {
  "#graphql\nquery GetReturn(\n  $id: ID!,\n  $rfoCount: Int = 10,\n  $rfoItemCount: Int = 50,\n  $returnLineItemCount: Int = 25\n) {\n  return(id: $id) {\n    id\n    name\n    status\n    createdAt\n    totalQuantity\n\n    # Return-level line items (reasons, notes, etc.)\n    returnLineItems(first: $returnLineItemCount) {\n      pageInfo { hasNextPage endCursor }\n      edges {\n        node {\n          ... on ReturnLineItem {\n            id\n            quantity\n            returnReason\n            returnReasonNote\n            fulfillmentLineItem {\n              id\n              lineItem { id name }\n            }\n            totalWeight { value }\n          }\n        }\n      }\n    }\n\n    # Reverse Fulfillment Orders (logistics for the return)\n    reverseFulfillmentOrders(first: $rfoCount) {\n      pageInfo { hasNextPage endCursor }\n      edges {\n        node {\n          id\n          status\n          lineItems(first: $rfoItemCount) {\n            pageInfo { hasNextPage endCursor }\n            edges {\n              node {\n                id\n                totalQuantity\n                fulfillmentLineItem {\n                  id\n                  lineItem { id name }\n                }\n                # Dispositions (e.g., RESTOCKED / PROCESSING_REQUIRED)\n                dispositions {\n                  type\n                  quantity\n                  location { id name }\n                }\n              }\n            }\n          }\n          # Optional: deliveries (labels/shipments going back)\n          reverseDeliveries(first: 10) {\n            edges { node { id } }\n          }\n        }\n      }\n    }\n\n    # Optional: exchange items related to this return\n    exchangeLineItems(first: 10) {\n      edges { node { id } }\n    }\n  }\n}\n": {return: GetReturnQuery, variables: GetReturnQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\nmutation ReturnApproveRequest($input: ReturnApproveRequestInput!) {\n  returnApproveRequest(input: $input) {\n    return {\n      id\n      name\n      status\n      totalQuantity\n      returnLineItems(first: 1) { edges { node { id } } }\n      order { id name }\n      reverseFulfillmentOrders(first: 10) {\n        pageInfo { hasNextPage endCursor }\n        edges {\n          node {\n            id\n            status\n            thirdPartyConfirmation { status }\n            order {\n              id\n              name\n              customer { id displayName defaultEmailAddress { emailAddress } }\n              billingAddress { name address1 address2 city zip phone countryCodeV2 }\n              shippingAddress { name address1 address2 city zip phone countryCodeV2 }\n            }\n            lineItems(first: 50) {\n              pageInfo { hasNextPage endCursor }\n              edges {\n                node {\n                  id\n                  totalQuantity\n                  fulfillmentLineItem { id lineItem { id name } }\n                  dispositions {\n                    id\n                    createdAt\n                    type\n                    quantity\n                    location { id name }\n                  }\n                }\n              }\n            }\n            reverseDeliveries(first: 10) {\n              edges {\n                node {\n                  id\n                  deliverable {\n                    ... on ReverseDeliveryShippingDeliverable {\n                      label { publicFileUrl createdAt updatedAt }\n                      tracking { carrierName number url }\n                    }\n                  }\n                  reverseDeliveryLineItems(first: 50) {\n                    edges {\n                      node {\n                        id\n                        dispositions {\n                          id\n                          createdAt\n                          type\n                          quantity\n                          location { id name }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    userErrors { code field message }\n  }\n}\n": {return: ReturnApproveRequestMutation, variables: ReturnApproveRequestMutationVariables},
  "#graphql\nmutation reverseDeliveryCreateWithShipping($reverseFulfillmentOrderId: ID!, $reverseDeliveryLineItems: [ReverseDeliveryLineItemInput!]!, $trackingInput: ReverseDeliveryTrackingInput, $labelInput: ReverseDeliveryLabelInput, $notifyCustomer: Boolean) {\n  reverseDeliveryCreateWithShipping(reverseFulfillmentOrderId: $reverseFulfillmentOrderId, reverseDeliveryLineItems: $reverseDeliveryLineItems, trackingInput: $trackingInput, labelInput: $labelInput, notifyCustomer: $notifyCustomer) {\n    reverseDelivery {\n        id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n": {return: ReverseDeliveryCreateWithShippingMutation, variables: ReverseDeliveryCreateWithShippingMutationVariables},
  "#graphql\n      mutation populateProduct($product: ProductCreateInput!) {\n        productCreate(product: $product) {\n          product {\n            id\n            title\n            handle\n            status\n            variants(first: 10) {\n              edges {\n                node {\n                  id\n                  price\n                  barcode\n                  createdAt\n                }\n              }\n            }\n          }\n        }\n      }": {return: PopulateProductMutation, variables: PopulateProductMutationVariables},
  "#graphql\n    mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {\n      productVariantsBulkUpdate(productId: $productId, variants: $variants) {\n        productVariants {\n          id\n          price\n          barcode\n          createdAt\n        }\n      }\n    }": {return: ShopifyReactRouterTemplateUpdateVariantMutation, variables: ShopifyReactRouterTemplateUpdateVariantMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}

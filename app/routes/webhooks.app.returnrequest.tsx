import { ActionFunctionArgs } from "react-router";

import { authenticate } from "../shopify.server";
import { Return } from "app/types/admin.types";
import {
  GetReturnQuery,
  ReturnApproveRequestMutation,
} from "app/types/admin.generated";
import { acceptReturnRequestMutation } from "app/graphql/acceptReturnRequest";
import buildConsignments from "app/utils/postConsignments";
import cargonizerApi from "app/utils/cargonizerApi";
import prepareLabels from "app/utils/prepareLabels";
import sendLabelToShopify from "app/utils/sendLabelToShopify";
import getCargonizerLabel from "app/utils/cargonizerApiGetLabel";
export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, session, topic, shop, admin } =
    await authenticate.webhook(request);
  /**
   * Start of flow
   * if the webhook is authenticated, we get the payload and can use this to accept return and get labels
   *
   *
   */
  console.log("Return request webhook received");
  console.log("now it should get labels for all consignments that needs it");
  if (!admin) {
    console.log("No admin client available");
    return new Response();
  }

  //prepare for mutation
  const { query, variables } = acceptReturnRequestMutation(
    payload.admin_graphql_api_id,
    true,
  );

  // Execute mutation to accept return request
  const response = await admin.graphql(query, { variables: variables });
  const { data } = await response?.json();
  //if no return data, exit
  if (!data.returnApproveRequest) {
    console.log("No return data found");
    return new Response();
  }
  //set type to data for easier development
  const returnData = data as ReturnApproveRequestMutation; // or as Return

  // Build consignments xml for Cargonizer
  const consignments = await buildConsignments(returnData);

  //send xml to cargonizer and get response
  const cargonizerResponse = await cargonizerApi(consignments.xml);
  //prepare labels for shopify, this saves the label in the data folder
  const preparedLabels = await prepareLabels(cargonizerResponse, returnData);

  //send labels to shopify, it will be a link that redirects to {{app_url}}/data/labels/{{consignmentId}}
  const shopifyResponse = await sendLabelToShopify(
    preparedLabels,
    admin.graphql,
  );
  console.log(shopifyResponse);

  //returns ok response to webhook
  return new Response();
};

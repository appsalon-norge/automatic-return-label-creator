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

  console.log("Return request webhook received");
  console.log("now it should get labels for all consignments that needs it");
  if (!admin) {
    console.log("No admin client available");
    return new Response();
  }
  const { query, variables } = acceptReturnRequestMutation(
    payload.admin_graphql_api_id,
    true,
  );
  const response = await admin.graphql(query, { variables: variables });
  const { data } = await response?.json();
  if (!data.returnApproveRequest) {
    console.log("No return data found");
    return new Response();
  }

  const returnData = data as ReturnApproveRequestMutation; // or as Return
  const consignments = await buildConsignments(returnData);
  const cargonizerResponse = await cargonizerApi(consignments.xml);
  const preparedLabels = await prepareLabels(cargonizerResponse, returnData);
  const shopifyResponse = await sendLabelToShopify(
    preparedLabels,
    admin.graphql,
  );
  console.log(shopifyResponse);
  return new Response();
};

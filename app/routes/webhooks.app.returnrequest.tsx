import type { ActionFunctionArgs } from "react-router";
import { authenticate, unauthenticated, sessionStorage } from "../shopify.server";
import { HttpResponseError } from "@shopify/shopify-api"; // 👈 legg til denne importen

import {
  ReturnApproveRequestMutation,
} from "app/types/admin.generated";
import { acceptReturnRequestMutation } from "app/graphql/acceptReturnRequest";
import buildConsignments from "app/utils/postConsignments";
import cargonizerApi from "app/utils/cargonizerApi";
import prepareLabels from "app/utils/prepareLabels";
import sendLabelToShopify from "app/utils/sendLabelToShopify";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log("Return request webhook received");
  console.log("Webhook authenticated", { topic, shop });

  const returnId = (payload as any)?.admin_graphql_api_id;
  console.log("Return ID from webhook payload:", returnId);

  const { admin, session } = await unauthenticated.admin(shop);
  console.log("Got offline admin client", {
    hasAdmin: !!admin,
    hasSession: !!session,
    accessTokenPrefix: session?.accessToken?.slice(0, 10),
  });

  if (!admin) {
    console.error("No admin client available for shop:", shop);
    return new Response("No admin client", { status: 500 });
  }

  try {
    // 1) Godkjenn return request
    const { query, variables } = acceptReturnRequestMutation(returnId, true); //Set to false to not send notification to customer for approved request
    const gqlResponse = await admin.graphql(query, { variables });
    const body = await gqlResponse.json();
    console.log(
      "ReturnApproveRequest result:",
      JSON.stringify(body, null, 2),
    );

    if (!body.data?.returnApproveRequest?.return) {
      console.error("No return data in mutation response");
      return new Response("No return data", { status: 500 });
    }

    const returnData = body.data as ReturnApproveRequestMutation;

    // 2) Bygg consignments XML
    const consignments = buildConsignments(returnData);

    // 3) Send til Cargonizer
    const cargonizerResponse = await cargonizerApi(consignments.xml);

    // 4) Forbered labels
    const preparedLabels = await prepareLabels(cargonizerResponse, returnData);

    // 5) Send label-link til Shopify
    const shopifyResponse = await sendLabelToShopify(
      preparedLabels,
      admin.graphql,
    );
    console.log("sendLabelToShopify response:", shopifyResponse);

    return new Response();
  } catch (err) {
    if (err instanceof HttpResponseError && err.response?.code === 401) {
      console.error("GraphQL HttpResponseError:", JSON.stringify({
        statusCode: err.response.code,
        statusText: err.response.statusText,
        body: err.response.body,
      }, null, 2));

      // 🔹 Slett offline-session som er ugyldig
      if (session?.id) {
        console.error(
          `Got 401 from Admin API for ${shop}, deleting offline session ${session.id}`
        );
        await sessionStorage.deleteSession(session.id);
      }

      // 🔹 Returner 401/500 slik at Shopify kan prøve webhooken på nytt senere
      return new Response("Admin API unauthorized", { status: 401 });
    }

    console.error("Unexpected error in returns/request webhook:", err);
    return new Response("Internal error", { status: 500 });
  }
};

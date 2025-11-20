import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();

  return (
    <s-page heading="Cargonizer retur etiketter">

      <s-section heading="Automatisk retur etiketter 🎉">
        <s-paragraph>
          Appsalon + Cargonizer retur løsning
        </s-paragraph>
      </s-section>
      
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

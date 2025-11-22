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
    <s-page heading="Appsalon + Cargonizer retur løsning">

      <s-section heading="Slik fungerer det 🎉">
      <ol>
        <li>Kunden forespør retur fra «Min side» i nettbutikken.</li>
        <li>Returforespørselen behandles automatisk, og retur­etikett sendes på e-post til kunden.</li>
        <li>Når varen er mottatt, må returen avsluttes og refunderes på vanlig måte i Shopify.</li>
      </ol>
    </s-section>
      
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

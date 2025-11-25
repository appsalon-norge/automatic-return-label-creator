// app/routes/app.settings.tsx
import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import {
  readReturnAddress,
  writeReturnAddress,
  type ReturnAddressConfig,
} from "../utils/returnAddressStorage";

type LoaderData = {
  config: ReturnAddressConfig | null;
};

// ----- Loader: return current config (if any) -----
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const config = await readReturnAddress();
  return { config } satisfies LoaderData;
};

// ----- Action: save posted config -----
export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  const formData = await request.formData();

  const config: ReturnAddressConfig = {
    name: formData.get("name")?.toString() || "",
    address1: formData.get("address1")?.toString() || "",
    postcode: formData.get("postcode")?.toString() || "",
    city: formData.get("city")?.toString() || "",
    country: formData.get("country")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    mobile: formData.get("mobile")?.toString() || "",
  };

  await writeReturnAddress(config);

  return { ok: true };
};

type FormState = {
  name: string;
  address1: string;
  postcode: string;
  city: string;
  country: string;
  email: string;
  mobile: string;
};

const emptyForm: FormState = {
  name: "",
  address1: "",
  postcode: "",
  city: "",
  country: "NO",
  email: "",
  mobile: "",
};

export default function SettingsPage() {
  const { config } = useLoaderData() as LoaderData;
  const fetcher = useFetcher<typeof action>();

  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    ...(config || {}),
  });

  const [justSaved, setJustSaved] = useState(false);

  const handleInput = (field: keyof FormState) => (event: any) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = () => {
    const data = new FormData();
    (Object.entries(form) as [keyof FormState, string][]).forEach(
      ([key, value]) => {
        data.append(key, value ?? "");
      },
    );
    fetcher.submit(data, { method: "post" });
  };

  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && (fetcher.data as any)?.ok) {
      setJustSaved(true);
      const timeout = setTimeout(() => setJustSaved(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <s-page heading="Innstillinger">
      <s-section heading="Retur adresse">
        <s-paragraph>
          Denne adressen vil bli brukt som butikkens returadresse på
          Cargonizer-etiketter. Hvis et felt står tomt, vil appen falle tilbake
          på standardadressen som er satt av Appsalon.
        </s-paragraph>

        {justSaved && (
          <s-box paddingBlockEnd="base">
             <s-banner tone="success" heading="Lagret">
            Endringer i returadressen er lagret.
            </s-banner>
          </s-box>
        )}

        <s-box
           padding="base"
           background="base"
           borderWidth="base"
           borderColor="subdued"
           borderRadius="base"
           maxInlineSize="480px"
        >
          <s-stack direction="block" gap="base">
            <s-text-field
              label="Navn/Bedrift"
              name="name"
              value={form.name}
              onInput={handleInput("name")}
              autocomplete="on"
            />

            <s-text-field
              label="Gate adresse"
              name="address1"
              value={form.address1}
              onInput={handleInput("address1")}
              autocomplete="on"
            />

            <s-stack direction="inline" gap="base">
              <s-text-field
                label="Postkode"
                name="postcode"
                value={form.postcode}
                onInput={handleInput("postcode")}
                autocomplete="on"
              />
              <s-text-field
                label="By"
                name="city"
                value={form.city}
                onInput={handleInput("city")}
                autocomplete="on"
              />
            </s-stack>

            <s-text-field
              label="Land"
              name="country"
              value={form.country}
              onInput={handleInput("country")}
              autocomplete="on"
            />

            <s-stack direction="inline" gap="base">
              <s-text-field
                label="E-post"
                name="email"
                value={form.email}
                onInput={handleInput("email")}
                autocomplete="on"
              />
              <s-text-field
                label="Tlf"
                name="mobile"
                value={form.mobile}
                onInput={handleInput("mobile")}
                autocomplete="on"
              />
            </s-stack>

            <s-stack direction="inline" gap="base">
              <s-button
                variant="primary"
                onClick={handleSave}
                loading={isSaving}
              >
                Lagre
              </s-button>
              {justSaved && <s-text tone="success">Lagret</s-text>}
            </s-stack>
          </s-stack>
        </s-box>
      </s-section>
    </s-page>
  );
}

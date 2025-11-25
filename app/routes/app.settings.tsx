// app/routes/app.settings.tsx (or app.additional.tsx)
import { useState } from "react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "react-router";
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
  // just return a plain object – React Router will pass this to useLoaderData
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

  // again: plain object is fine
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

export default function settings() {
  const { config } = useLoaderData() as LoaderData;
  const fetcher = useFetcher<typeof action>();
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    ...(config || {}),
  });

  const onChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const isSaving = fetcher.state !== "idle";
  const saved = fetcher.data && (fetcher.data as any).ok;

  return (
    <s-page heading="Return settings">
      <s-section heading="Return address used on labels">
        <s-paragraph>
          This address will be used as the store’s return address on
          Cargonizer labels. If a field is left empty, the app will fall back
          to the <code>LOGISTRA_RETURN_ADDRESS_*</code> environment variables
          (and then the built-in defaults).
        </s-paragraph>

        <fetcher.Form method="post">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "480px",
            }}
          >
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={onChange("name")}
              />
            </label>

            <label>
              Address line 1
              <input
                name="address1"
                value={form.address1}
                onChange={onChange("address1")}
              />
            </label>

            <div style={{ display: "flex", gap: "8px" }}>
              <label style={{ flex: 1 }}>
                Postcode
                <input
                  name="postcode"
                  value={form.postcode}
                  onChange={onChange("postcode")}
                />
              </label>

              <label style={{ flex: 2 }}>
                City
                <input
                  name="city"
                  value={form.city}
                  onChange={onChange("city")}
                />
              </label>

              <label style={{ flex: 1 }}>
                Country
                <input
                  name="country"
                  value={form.country}
                  onChange={onChange("country")}
                />
              </label>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <label style={{ flex: 1 }}>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                />
              </label>

              <label style={{ flex: 1 }}>
                Mobile
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={onChange("mobile")}
                />
              </label>
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <button type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : "Save"}
              </button>
              {saved && <span>✅ Saved</span>}
            </div>
          </div>
        </fetcher.Form>
      </s-section>
    </s-page>
  );
}

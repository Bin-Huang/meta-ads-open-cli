import type { Credentials } from "./auth.js";

const BASE_URL = "https://graph.facebook.com/v24.0";

interface CallOptions {
  creds: Credentials;
  path: string;
  params?: Record<string, string>;
}

export async function callApi(opts: CallOptions): Promise<unknown> {
  const url = new URL(`${BASE_URL}/${opts.path}`);
  url.searchParams.set("access_token", opts.creds.access_token);
  if (opts.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString());
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { rawResponse: text };
  }

  if (!res.ok) {
    const err = data as Record<string, unknown>;
    const errObj = err?.error as Record<string, unknown> | undefined;
    const msg = errObj?.message ? String(errObj.message) : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

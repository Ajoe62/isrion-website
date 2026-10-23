// Newsletter sign-up endpoint, called by src/components/SubscribeForm.astro.
//
// Runs as a Vercel function (the rest of the site stays static). It asks Brevo
// to send a double opt-in email, so a contact only joins the list once they
// click the confirmation link. Configure these in the Vercel project settings
// (and in a local .env for `npm run dev`); none are ever sent to the browser:
//
//   BREVO_API_KEY          Brevo > SMTP & API > API keys
//   BREVO_LIST_ID          numeric ID of the newsletter list
//   BREVO_DOI_TEMPLATE_ID  numeric ID of the double opt-in template
//   BREVO_REDIRECT_URL     where the confirm link lands, e.g.
//                          https://www.isrioninternational.com/news?subscribed=1#subscribe
import type { APIRoute } from "astro";

export const prerender = false;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (status: number, ok: boolean, message: string) =>
  new Response(JSON.stringify({ ok, message }), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData().catch(() => null);
  if (!form) return json(400, false, "Invalid request.");

  // Bots fill every field; people never see this one. Pretend it worked.
  if (String(form.get("_gotcha") ?? "")) {
    return json(200, true, "Check your inbox to confirm your subscription.");
  }

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL.test(email)) {
    return json(400, false, "Please enter a valid email address.");
  }

  const env = import.meta.env;
  const apiKey = env.BREVO_API_KEY;
  const listId = Number(env.BREVO_LIST_ID);
  const templateId = Number(env.BREVO_DOI_TEMPLATE_ID);
  const redirectionUrl = env.BREVO_REDIRECT_URL;
  if (!apiKey || !listId || !templateId || !redirectionUrl) {
    console.error("[subscribe] Brevo environment variables are not set.");
    return json(503, false, "Subscriptions are temporarily unavailable. Please try again later.");
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, includeListIds: [listId], templateId, redirectionUrl }),
    });

    if (res.ok) {
      return json(200, true, "Almost done: check your inbox and confirm your subscription.");
    }

    const err = await res.json().catch(() => null);
    // Already on the list: treat as success so we don't reveal who subscribes.
    if (err?.code === "duplicate_parameter") {
      return json(200, true, "Almost done: check your inbox and confirm your subscription.");
    }
    console.error("[subscribe] Brevo error", res.status, err);
    return json(502, false, "We couldn't subscribe you just now. Please try again shortly.");
  } catch (e) {
    console.error("[subscribe] Brevo request failed", e);
    return json(502, false, "We couldn't subscribe you just now. Please try again shortly.");
  }
};

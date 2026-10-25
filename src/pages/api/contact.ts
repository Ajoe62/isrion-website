// Contact form endpoint, called by src/components/ContactForm.astro.
//
// Runs as a Vercel function. It checks the Cloudflare Turnstile token, then
// uses Brevo's transactional email API to send two emails:
//
//   1. a notification to the team (CONTACT_TO), with Reply-To set to the
//      visitor so a plain "Reply" in Gmail answers them directly;
//   2. a short acknowledgement to the visitor, so they know it arrived.
//
// The acknowledgement is deliberately generic: it never repeats the visitor's
// name or message, so nobody can use this form to send their own text to a
// third party's inbox. Configure these in the Vercel project settings (and in
// a local .env for `npm run dev`); none are ever sent to the browser:
//
//   BREVO_API_KEY         Brevo > SMTP & API > API keys (shared with /api/subscribe)
//   CONTACT_TO            where enquiries go, e.g. support@isrioninternational.com
//   CONTACT_FROM          sender for both emails; must be on the domain
//                         authenticated in Brevo, e.g. support@isrioninternational.com
//   TURNSTILE_SECRET_KEY  Cloudflare > Turnstile > your widget > Secret key
import type { APIRoute } from "astro";
import { company } from "../../data/site";

export const prerender = false;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 100, organisation: 150, message: 5000 };

const json = (status: number, ok: boolean, message: string) =>
  new Response(JSON.stringify({ ok, message }), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Single line, no control characters: safe for subjects and display names.
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function verifyTurnstile(secret: string, token: string, ip?: string) {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => null);
  return Boolean(data?.success);
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(`Brevo ${res.status}: ${JSON.stringify(err)}`);
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const form = await request.formData().catch(() => null);
  if (!form) return json(400, false, "Invalid request.");

  const success = "Thanks, your message has been sent. We've emailed you a confirmation and will be in touch shortly.";

  // Bots fill every field; people never see this one. Pretend it worked.
  if (String(form.get("_gotcha") ?? "")) return json(200, true, success);

  const name = oneLine(String(form.get("name") ?? ""));
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const organisation = oneLine(String(form.get("organisation") ?? ""));
  const message = String(form.get("message") ?? "").trim();

  if (!name || name.length > LIMITS.name) return json(400, false, "Please enter your name.");
  if (!email || email.length > 254 || !EMAIL.test(email)) {
    return json(400, false, "Please enter a valid email address.");
  }
  if (organisation.length > LIMITS.organisation) return json(400, false, "Organisation name is too long.");
  if (!message) return json(400, false, "Please tell us how we can help.");
  if (message.length > LIMITS.message) {
    return json(400, false, `Please keep your message under ${LIMITS.message} characters.`);
  }

  const env = import.meta.env;
  const apiKey = env.BREVO_API_KEY;
  const to = env.CONTACT_TO;
  const from = env.CONTACT_FROM;
  const turnstileSecret = env.TURNSTILE_SECRET_KEY;
  if (!apiKey || !to || !from || !turnstileSecret) {
    console.error("[contact] Brevo or Turnstile environment variables are not set.");
    return json(503, false, `The form is temporarily unavailable. Please email us at ${company.email}.`);
  }

  const token = String(form.get("cf-turnstile-response") ?? "");
  let ip: string | undefined;
  try { ip = clientAddress; } catch { /* not available in every runtime */ }
  if (!token || !(await verifyTurnstile(turnstileSecret, token, ip).catch(() => false))) {
    return json(400, false, "We couldn't verify you're human. Please try again.");
  }

  const sender = { name: company.name, email: from };
  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Organisation", organisation || "(not given)"],
  ];

  // 1. Notification to the team. If this fails, the enquiry is lost, so report it.
  try {
    await sendEmail(apiKey, {
      sender,
      to: [{ email: to }],
      replyTo: { email, name },
      subject: oneLine(`New enquiry: ${name}${organisation ? `, ${organisation}` : ""}`),
      textContent: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}\n\nReply to this email to answer ${name} directly.`,
      htmlContent:
        `<table cellpadding="4" style="font-family:sans-serif;font-size:14px">` +
        rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join("") +
        `</table><p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(message)}</p>` +
        `<p style="font-family:sans-serif;font-size:12px;color:#666">Reply to this email to answer ${escapeHtml(name)} directly.</p>`,
      tags: ["contact-form"],
    });
  } catch (e) {
    console.error("[contact] notification failed", e);
    return json(502, false, `We couldn't send your message just now. Please email us at ${company.email}.`);
  }

  // 2. Acknowledgement to the visitor. The enquiry is already delivered, so a
  // failure here is only logged.
  try {
    await sendEmail(apiKey, {
      sender,
      to: [{ email }],
      replyTo: { email: from, name: company.name },
      subject: `We've received your message | ${company.short}`,
      textContent:
        `Hello,\n\nThank you for contacting ${company.name}. This is a quick note to confirm we've received your message through our website. ` +
        `A member of our team will reply within two working days.\n\nIf you need to add anything, simply reply to this email.\n\n` +
        `Kind regards,\n${company.name}\n${company.url}\n\nYou're receiving this because this address was entered in the contact form on our website.`,
      htmlContent:
        `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;max-width:560px">` +
        `<p>Hello,</p>` +
        `<p>Thank you for contacting ${company.name}. This is a quick note to confirm we've received your message through our website. ` +
        `A member of our team will reply within two working days.</p>` +
        `<p>If you need to add anything, simply reply to this email.</p>` +
        `<p>Kind regards,<br>${company.name}<br><a href="${company.url}">${company.url.replace(/^https?:\/\//, "")}</a></p>` +
        `<p style="font-size:12px;color:#777">You're receiving this because this address was entered in the contact form on our website.</p>` +
        `</div>`,
      tags: ["contact-ack"],
    });
  } catch (e) {
    console.error("[contact] acknowledgement failed", e);
  }

  return json(200, true, success);
};

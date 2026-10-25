// Email Worker for support@isrioninternational.com.
//
// Cloudflare Email Routing hands every message sent to support@ to this
// Worker, which:
//   1. forwards it to the support inbox (FORWARD_TO), always;
//   2. sends the sender one short "we've received your message" reply.
//
// The reply is skipped for anything automated (bounces, mailing lists,
// newsletters, other auto-replies, no-reply senders) and for mail from our own
// domain, such as the website's contact form notifications. Without these
// checks two auto-responders can reply to each other forever.
import { EmailMessage } from "cloudflare:email";

interface Env {
  FORWARD_TO: string;
  REPLY_NAME: string;
  SITE_URL: string;
  // Optional KV namespace: at most one auto-reply per sender per day.
  REPLIED?: KVNamespace;
}

const ONE_DAY = 60 * 60 * 24;
const NO_REPLY_SENDER =
  /^(no-?reply|do-?not-?reply|mailer-daemon|postmaster|bounces?|notifications?|alerts?)([+._-]|@)/i;

// Pull the bare address out of a header like `"Jane Doe" <jane@example.com>`.
const addressOf = (header: string | null) => {
  if (!header) return "";
  const angled = header.match(/<([^>]+)>/);
  return (angled ? angled[1] : header).trim().toLowerCase();
};

const domainOf = (address: string) => address.split("@")[1] ?? "";

function shouldReply(message: ForwardableEmailMessage): boolean {
  const h = message.headers;
  const sender = message.from.toLowerCase();
  const headerFrom = addressOf(h.get("from"));
  const ownDomain = domainOf(message.to.toLowerCase());

  if (!sender || sender === "<>") return false; // bounce
  if (domainOf(sender) === ownDomain || domainOf(headerFrom) === ownDomain) return false;
  if (NO_REPLY_SENDER.test(sender) || NO_REPLY_SENDER.test(headerFrom)) return false;

  const autoSubmitted = h.get("auto-submitted");
  if (autoSubmitted && autoSubmitted.toLowerCase() !== "no") return false;
  if (/^(bulk|list|junk|auto_reply)$/i.test(h.get("precedence") ?? "")) return false;
  if (h.has("list-id") || h.has("list-unsubscribe")) return false;
  if (h.has("x-autoreply") || h.has("x-autorespond")) return false;
  if (/all|autoreply|oof/i.test(h.get("x-auto-response-suppress") ?? "")) return false;

  return true;
}

// Headers must be one line of ASCII; encode anything else as RFC 2047 UTF-8.
function headerText(value: string): string {
  const clean = value.replace(/[\r\n]+/g, " ").trim();
  if (!/[^\x20-\x7e]/.test(clean)) return clean;
  const bytes = new TextEncoder().encode(clean);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return `=?UTF-8?B?${btoa(binary)}?=`;
}

function buildReply(message: ForwardableEmailMessage, env: Env): string {
  const from = message.to;
  const to = message.from;
  const original = message.headers.get("subject")?.trim() || "your message";
  const subject = /^re:/i.test(original) ? original : `Re: ${original}`;
  const inReplyTo = message.headers.get("message-id");
  const references = [message.headers.get("references"), inReplyTo].filter(Boolean).join(" ");

  const body = [
    "Hello,",
    "",
    `Thank you for contacting ${env.REPLY_NAME}. This is an automatic reply to confirm we've received your email.`,
    "A member of our team will get back to you within two working days.",
    "",
    "If you need to add anything, simply reply to this email.",
    "",
    "Kind regards,",
    env.REPLY_NAME,
    env.SITE_URL,
  ].join("\r\n");

  const headers = [
    `From: ${headerText(env.REPLY_NAME)} <${from}>`,
    `To: ${to}`,
    `Subject: ${headerText(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domainOf(from)}>`,
    inReplyTo ? `In-Reply-To: ${inReplyTo}` : "",
    references ? `References: ${headerText(references)}` : "",
    // Tells other mail systems not to auto-reply to this reply.
    "Auto-Submitted: auto-replied",
    "X-Auto-Response-Suppress: All",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 7bit",
  ].filter(Boolean);

  return `${headers.join("\r\n")}\r\n\r\n${body}\r\n`;
}

export default {
  async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
    // Delivery first: if forwarding fails, let it throw so the sender gets a
    // bounce instead of a reply claiming we received it.
    await message.forward(env.FORWARD_TO);

    if (!shouldReply(message)) return;

    const sender = message.from.toLowerCase();
    try {
      if (env.REPLIED && (await env.REPLIED.get(sender))) return;
      // Cloudflare only allows a reply when the incoming message passes DMARC,
      // which also stops spoofed senders from receiving our reply.
      await message.reply(new EmailMessage(message.to, message.from, buildReply(message, env)));
      await env.REPLIED?.put(sender, "1", { expirationTtl: ONE_DAY });
    } catch (e) {
      console.error("[support-autoreply] reply skipped", e);
    }
  },
} satisfies ExportedHandler<Env>;

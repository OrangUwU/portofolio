import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PROJECT_TYPES = ["General", "Product", "Research", "Film", "Branding"] as const;
type ProjectType = (typeof PROJECT_TYPES)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  name: unknown;
  email: unknown;
  projectType: unknown;
  message: unknown;
};

function validate(body: Payload): { ok: true; data: { name: string; email: string; projectType: ProjectType; message: string } } | { ok: false; error: string } {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const projectType = typeof body.projectType === "string" ? body.projectType : "General";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2) return { ok: false, error: "Nama minimal 2 karakter." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Format email tidak valid." };
  if (!(PROJECT_TYPES as readonly string[]).includes(projectType)) return { ok: false, error: "Kategori projectType tidak valid." };
  if (message.length < 5) return { ok: false, error: "Pesan minimal 5 karakter." };

  return { ok: true, data: { name, email, projectType: projectType as ProjectType, message } };
}

async function postDiscordWebhook(url: string, data: { name: string; email: string; projectType: string; message: string }) {
  const embed = {
    title: "📩 Contact — Direct Message",
    color: 0xff3b30,
    fields: [
      { name: "Nama", value: data.name, inline: true },
      { name: "Kategori", value: data.projectType, inline: true },
      { name: "Email", value: data.email, inline: false },
      { name: "Pesan", value: data.message.slice(0, 1024) || "—", inline: false },
      { name: "Waktu", value: new Date().toISOString(), inline: false },
    ],
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });
  if (!res.ok) throw new Error(`Discord webhook ${res.status}: ${await res.text().catch(() => "")}`);
}

async function postTelegram(token: string, chatId: string, data: { name: string; email: string; projectType: string; message: string }) {
  const text =
    `*Contact — Direct Message*\n` +
    `*Nama:* ${escapeMd(data.name)}\n` +
    `*Email:* ${escapeMd(data.email)}\n` +
    `*Kategori:* ${escapeMd(data.projectType)}\n` +
    `*Pesan:* ${escapeMd(data.message)}\n` +
    `_${escapeMd(new Date().toISOString())}_`;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text().catch(() => "")}`);
}

function escapeMd(s: string) {
  return s.replace(/[_*`\[\]]/g, "\\$&");
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Body JSON tidak valid." }, { status: 400 });
  }

  const v = validate(body);
  if (!v.ok) return NextResponse.json({ ok: false, error: v.error }, { status: 400 });

  const { name, email, projectType, message } = v.data;

  const discordUrl = process.env.DISCORD_WEBHOOK_URL?.trim();
  const tgToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const tgChatId = process.env.TELEGRAM_CHAT_ID?.trim();

  try {
    if (discordUrl) {
      await postDiscordWebhook(discordUrl, { name, email, projectType, message });
      return NextResponse.json({ ok: true, message: "Pesan berhasil dikirim via Discord." }, { status: 200 });
    }
    if (tgToken && tgChatId) {
      await postTelegram(tgToken, tgChatId, { name, email, projectType, message });
      return NextResponse.json({ ok: true, message: "Pesan berhasil dikirim via Telegram." }, { status: 200 });
    }

    console.log("[contact] payload (simulasi backend terverifikasi):", { name, email, projectType, message });
    return NextResponse.json({ ok: true, message: "Pesan berhasil diterima (simulasi backend terverifikasi)" }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[contact] webhook error:", msg);
    return NextResponse.json({ ok: false, error: `Gagal mengirim webhook: ${msg}` }, { status: 500 });
  }
}

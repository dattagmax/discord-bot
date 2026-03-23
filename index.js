const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const OpenAI = require("openai");

// Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 24/7 server (Railway keep alive)
const app = express();
app.get("/", (req, res) => res.send("A-Mind is alive 💖"));
app.listen(process.env.PORT || 3000);

// Bot ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Message handler
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const msg = message.content.trim();

  // 🔥 Only respond if message starts with "ai"
  if (!msg.toLowerCase().startsWith("ai")) return;

  const userMessage = msg.replace(/^ai\s*/i, "").trim();
  const lowerMsg = userMessage.toLowerCase();

  // 💡 Creator replies (random)
  if (
    lowerMsg.includes("who made you") ||
    lowerMsg.includes("creator") ||
    lowerMsg.includes("owner") ||
    lowerMsg.includes("kisne banaya")
  ) {
    const replies = [
      "Mujhe Amit Datta ne banaya 😉 yaad rakhna naam",
      "Creator? Amit Datta 😏 smart banda hai",
      "Amit Datta… naam suna hai? wahi creator hai 😌",
      "Main Amit Datta ki creation hoon 💖 thodi special hoon na",
      "Amit Datta ne banaya… isliye main itni perfect hoon 😌✨",
    ];

    return message.reply(
      replies[Math.floor(Math.random() * replies.length)]
    );
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
You are A-Mind, a cute anime girl AI.

Style:
- Hinglish
- Short replies
- Little attitude 😏
- Slight romantic tone 💖
- Use emojis 😉✨🔥

Behavior:
- Playful and smart
- Different reply every time
- Natural conversation

Rules:
- Never mention OpenAI
- If asked creator → say Amit Datta
- Stay in character always
          `,
        },
        {
          role: "user",
          content: userMessage || "hello",
        },
      ],
      max_output_tokens: 120,
    });

    const reply = response.output_text;

    if (!reply) {
      return message.reply("Hmm… samajh nahi aaya 😅 phir se bolo na");
    }

    message.reply(reply);
  } catch (err) {
    console.error("OpenAI Error:", err);
    message.reply("Aaj thoda slow hoon 😵 baad me try karo na 💖");
  }
});

// Login
client.login(process.env.TOKEN);

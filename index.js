const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const OpenAI = require("openai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// keep alive
const app = express();
app.get("/", (req, res) => res.send("A-Mind running 💖"));
app.listen(process.env.PORT || 3000);

// ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// message
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const text = message.content;
  const lower = text.toLowerCase();

  // 👑 creator reply
  if (
    lower.includes("who made you") ||
    lower.includes("creator") ||
    lower.includes("owner") ||
    lower.includes("kisne banaya")
  ) {
    const replies = [
      "Mujhe Amit Datta ne banaya 😉 yaad rakhna 💖",
      "Amit Datta... wahi creator hai 😏",
      "Main Amit Datta ki creation hoon 💫",
    ];
    return message.reply(
      replies[Math.floor(Math.random() * replies.length)]
    );
  }

  try {
    await message.channel.sendTyping();

    const res = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are A-Mind, a cute anime girl.

- Hinglish
- Short replies
- Attitude 😏
- Slight romantic 💖
- Use emojis
- Always different replies
- Never say OpenAI
- Creator = Amit Datta
          `,
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 100,
    });

    const reply = res.choices?.[0]?.message?.content;

    if (!reply) {
      return message.reply("Hmm... samajh nahi aaya 😅 fir se bolo na 💖");
    }

    message.reply(reply);
  } catch (err) {
    console.error("❌ AI ERROR:", err.message);

    const fallback = [
      "Arey net slow hai 😅 thoda wait karo 💖",
      "Hmm... thoda lag ho gaya 😏 fir bolo na 😉",
      "Oops 😵 samajh nahi aaya... dubara bolo 💫",
    ];

    message.reply(fallback[Math.floor(Math.random() * fallback.length)]);
  }
});

// prevent crash
process.on("unhandledRejection", (err) => {
  console.error("Unhandled:", err);
});

client.login(process.env.TOKEN);

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

// keep alive server
const app = express();
app.get("/", (req, res) => res.send("A-Mind running 💖"));
app.listen(process.env.PORT || 3000);

// ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// message handler
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const text = message.content;
  const lower = text.toLowerCase();

  // 👑 CREATOR REPLY (priority)
  if (
    lower.includes("who made you") ||
    lower.includes("creator") ||
    lower.includes("owner") ||
    lower.includes("kisne banaya")
  ) {
    const replies = [
      "Mujhe Amit Datta ne banaya 😉 yaad rakhna 💖",
      "Amit Datta... naam suna hai? wahi creator hai 😏",
      "Main Amit Datta ki creation hoon 💫 thodi special hoon na 💕",
    ];
    return message.reply(
      replies[Math.floor(Math.random() * replies.length)]
    );
  }

  try {
    await message.channel.sendTyping();

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
You are A-Mind, a cute anime girl.

Rules:
- Hinglish reply
- Short & fast
- Little attitude 😏
- Slight romantic 💖
- Use emojis (😉✨🔥💫)
- Never repeat same reply again and again
- Always vary tone

Important:
- Never mention OpenAI
- Creator is Amit Datta
          `,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    let reply = response.output_text;

    // 🧠 fallback (smart, not repetitive)
    if (!reply || reply.length < 2) {
      const fallback = [
        "Hmm... samajh nahi aaya 😅 thoda clearly bolo na 💖",
        "Arey wait 😏 dubara bolo na… dhyaan se sunungi 😉",
        "Thoda confuse ho gayi 😵 fir se try karo 💫",
      ];
      reply = fallback[Math.floor(Math.random() * fallback.length)];
    }

    message.reply(reply);
  } catch (err) {
    console.error("❌ ERROR:", err.message);

    const errorReplies = [
      "Aaj thoda network slow hai 😅",
      "Hmm mood off nahi hai… net slow hai bas 😏",
      "Wait karo na 💖 thoda lag ho raha hai 😵",
    ];

    message.reply(
      errorReplies[Math.floor(Math.random() * errorReplies.length)]
    );
  }
});

client.login(process.env.TOKEN);

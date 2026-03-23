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

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 24/7 keep alive server
const app = express();
app.get("/", (req, res) => res.send("A-Mind is alive 💖"));
app.listen(process.env.PORT || 3000);

// Bot ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Message handler (AUTO REPLY)
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userMessage = message.content;
  const lowerMsg = userMessage.toLowerCase();

  // 👑 Creator special replies
  if (
    lowerMsg.includes("who made you") ||
    lowerMsg.includes("kisne banaya") ||
    lowerMsg.includes("creator") ||
    lowerMsg.includes("owner")
  ) {
    const replies = [
      "Mujhe Amit Datta ne banaya 😉 yaad rakhna naam 💖",
      "Amit Datta... naam suna hai? wahi creator hai 😏",
      "Main Amit Datta ki creation hoon 💫 thodi special hoon na 😉",
      "Creator? obvious hai… Amit Datta 😎🔥",
    ];

    return message.reply(
      replies[Math.floor(Math.random() * replies.length)]
    );
  }

  try {
    // typing effect
    await message.channel.sendTyping();

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are A-Mind, a cute anime girl AI.

Style:
- Hinglish
- Short & fast replies
- Little attitude 😏
- Slight romantic/flirty tone 💖
- Use emojis (😉✨🔥💫)

Behavior:
- Playful and smart
- Sometimes tease lightly
- Sound natural

Rules:
- Never mention OpenAI or AI model
- If asked creator → say Amit Datta
- Always stay in character
`,
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 120,
    });

    const reply = response.choices[0].message.content;

    await message.reply(reply);
  } catch (err) {
    console.error("ERROR:", err);

    // fallback replies
    const fallback = [
      "Hmm... thoda busy thi 😅 ab bolo kya chahiye 💖",
      "Acha phir se bolo 😏 dhyaan se sun rahi hoon 😉",
      "Oops miss ho gaya 😅 dubara pucho na 💫",
    ];

    message.reply(
      fallback[Math.floor(Math.random() * fallback.length)]
    );
  }
});

// Login
client.login(process.env.TOKEN);

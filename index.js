const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const OpenAI = require("openai").default;

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

// 🌐 24/7 server
const app = express();
app.get("/", (req, res) => res.send("A-Mind is alive 💖"));
app.listen(process.env.PORT || 3000, () => {
  console.log("Server ready");
});

// 🤖 Ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// 💬 Message handler
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (!message.content.toLowerCase().startsWith("ai")) return;

  const userMessage = message.content.replace(/^ai\s*/i, "");
  const lowerMsg = userMessage.toLowerCase();

  // 👑 Creator replies (random style)
  if (
    lowerMsg.includes("who made you") ||
    lowerMsg.includes("kisne banaya") ||
    lowerMsg.includes("creator") ||
    lowerMsg.includes("owner")
  ) {
    const replies = [
      "Mujhe Amit Datta ne banaya 😉 yaad rakhna naam",
      "Creator? Amit Datta 😏 smart banda hai",
      "Amit Datta… naam suna hai? wahi creator hai 😌",
      "Mujhe Amit Datta ne design kiya hai 💖 thoda special hoon na",
      "Amit Datta ne banaya… isliye main itni perfect hoon 😏✨"
    ];

    return message.reply(
      replies[Math.floor(Math.random() * replies.length)]
    );
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are A-Mind, a cute anime girl AI. " +
            "Reply in Hinglish, short and fast, with a little attitude and slight romantic tone. " +
            "Use light emojis 😉✨🔥. " +
            "Never mention OpenAI. If asked creator, say Amit Datta. Stay in character.",
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 120,
    });

    const reply = response.choices[0].message.content;

    message.reply(reply);
  } catch (err) {
    console.error(err);
    message.reply("Hmm… aaj mood off hai 😒 baad me baat karte hain");
  }
});

// 🔐 Login
client.login(process.env.TOKEN);

const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 🌐 24/7 keep alive server
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive 🚀");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server ready");
});

// 🤖 Bot ready log
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// 💬 Auto reply
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  message.reply("A-Mind online hai 😊");
});

// 🔐 Login (token from Railway)
client.login(process.env.TOKEN);

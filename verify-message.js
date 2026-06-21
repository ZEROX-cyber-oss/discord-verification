const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

require("dotenv").config();

const TOKEN = process.env.BOT_TOKEN;const CHANNEL_ID = "1518147593396551781";

client.once("ready", async () => {

  const channel = await client.channels.fetch(CHANNEL_ID);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("✅ Se vérifier")
      .setStyle(ButtonStyle.Link)
      .setURL("http://localhost:3000")
  );

  await channel.send({
    content: "Clique sur le bouton ci-dessous pour te vérifier.",
    components: [row]
  });

  console.log("Message envoyé");
  process.exit();
});

client.login(TOKEN);
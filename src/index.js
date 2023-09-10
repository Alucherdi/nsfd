const {
  Client,
  Events,
  GatewayIntentBits,
} = require("discord.js");

const { token } = require("../env.json");
const nsfw_filter = require("./events_handler/nsfw_filter");

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.DirectMessageReactions,
] });

client.on(Events.MessageCreate, async msg => {
  if (msg.author.bot) return;
  // > 10 minutes ? dont check
  if (((new Date() - msg.member.joinedAt) / 60000) > 10) return;

  if (msg.attachments.size === 0) return;

  nsfw_filter(msg);
});


client.once(Events.ClientReady, () => {
  console.log("Ready");
});

client.on(Events.Error, console.log);

client.login(token);

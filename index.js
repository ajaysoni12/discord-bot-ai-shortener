require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const logger = require("./utils/logger");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Load commands
client.on("ready", async () => {
  logger.info("🚀 Bot is ready! Loading commands...");

  const commandsDir = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsDir)
    .filter((f) => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(commandsDir, file));
    client.commands.set(command.data.name, command);
    logger.info(`Loaded command: ${command.data.name}`);
  }

  logger.info(`${client.commands.size} commands loaded`);
});

// Handle slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return await interaction.reply({
      content: "❌ Unknown command!",
      ephemeral: true,
    });
  }

  try {
    logger.info(`${interaction.user.tag} used /${interaction.commandName}`);
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing ${interaction.commandName}`, error.message);

    const content = "❌ Something went wrong!";
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content, ephemeral: true });
    } else {
      await interaction.reply({ content, ephemeral: true });
    }
  }
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled rejection", error);
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => logger.info("✓ Bot logged in"))
  .catch((error) => {
    logger.error("Failed to login", error);
    process.exit(1);
  });

module.exports = client;

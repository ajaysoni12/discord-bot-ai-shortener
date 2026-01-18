/**
 * Command Registration Script
 * Registers all slash commands with Discord API
 * Run this once to register commands, or when you add new commands
 */

require("dotenv").config();
const path = require("path");
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const logger = require("./utils/logger");

// Validate required environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  logger.error("Missing DISCORD_TOKEN or DISCORD_CLIENT_ID in .env file");
  process.exit(1);
}

// Initialize REST client
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

/**
 * Load all command data from commands directory
 */
function loadCommandData() {
  const commands = [];
  const commandsDir = path.join(__dirname, "commands");

  const commandFiles = fs
    .readdirSync(commandsDir)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    try {
      const command = require(path.join(commandsDir, file));

      if (command.data) {
        commands.push(command.data.toJSON());
        logger.info(`✓ Loaded command: ${command.data.name}`);
      }
    } catch (error) {
      logger.error(`Failed to load command file: ${file}`, error);
    }
  }

  return commands;
}

/**
 * Register commands with Discord
 */
async function registerCommands() {
  try {
    logger.info("🔄 Starting command registration...");

    const commands = loadCommandData();

    logger.info(`📝 Registering ${commands.length} commands...`);

    const data = await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
      body: commands,
    });

    logger.info(
      `✅ Successfully registered ${data.length} application commands!`
    );
    logger.info(
      "💡 Tip: Commands may take up to 1 hour to appear in Discord, but usually show up instantly"
    );
  } catch (error) {
    logger.error("❌ Failed to register commands", error);
    process.exit(1);
  }
}

// Run registration
registerCommands();

const { SlashCommandBuilder } = require("discord.js");
const logger = require("../utils/logger");
const { checkRateLimit } = require("../utils/rateLimiter");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shorten")
    .setDescription("Create a short URL")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The URL to shorten")
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const url = interaction.options.getString("url");

    const limit = checkRateLimit(userId);
    if (limit.isLimited) {
      return interaction.reply({
        content: `⏱️ Slow down! Try again in ${Math.ceil(
          limit.resetTime / 1000
        )}s`,
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    try {
      logger.info(`${interaction.user.tag} shortened: ${url}`);

      const shortenerUrl =
        process.env.SHORTENER_API_URL || "http://localhost:8001/api/shortenurl";
      const response = await fetch(shortenerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url }),
      });

      if (!response.ok) throw new Error("Shortener failed");

      const data = await response.json();
      if (!data.shortUrl) throw new Error("No short URL returned");

      interaction.editReply(`✅ Short URL: ${data.shortUrl}`);
    } catch (error) {
      logger.error("Shorten error", error.message);
      interaction.editReply(
        "❌ Failed to shorten URL. Is the shortener service running?"
      );
    }
  },
};

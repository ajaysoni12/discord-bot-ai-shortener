const { SlashCommandBuilder } = require("discord.js");
const Groq = require("groq-sdk");
const logger = require("../utils/logger");
const { checkRateLimit } = require("../utils/rateLimiter");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask me anything!")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("What do you want to know?")
        .setRequired(true)
        .setMaxLength(2000)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const question = interaction.options.getString("question");

    // Check rate limit
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
      logger.info(
        `${interaction.user.tag} asked: ${question.substring(0, 50)}`
      );

      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful Discord bot. Answer questions clearly and concisely.",
          },
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: 1024,
      });

      const answer = response.choices[0].message.content;

      if (!answer) {
        return interaction.editReply("❌ Couldn't get an answer. Try again!");
      }

      interaction.editReply(answer);
    } catch (error) {
      logger.error("Ask error", error.message);
      interaction.editReply("❌ Something went wrong. Try again later!");
    }
  },
};

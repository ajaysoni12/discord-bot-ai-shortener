const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all commands"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("🤖 Commands")
      .addFields(
        {
          name: "/ask",
          value: "Ask me anything with AI",
          inline: false,
        },
        {
          name: "/shorten",
          value: "Create a short URL",
          inline: false,
        },
        {
          name: "/ping",
          value: "Check bot latency",
          inline: false,
        }
      );

    await interaction.reply({ embeds: [embed] });
  },
};

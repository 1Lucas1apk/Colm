const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Get a funny Pong response with ping time!'),
  async execute(interaction) {
    const sentTimestamp = Date.now();
    await interaction.deferReply();

    const messages = [
      "Pong! Did I beat Usain Bolt?",
      "Pong! I'm faster than a caffeinated sloth!",
      "Pong! Slower than a snail on vacation...",
      "Pong! Am I winning the race?",
    ];

    const randomPongMessage = messages[Math.floor(Math.random() * pongMessages.length)];
    const pingTime = Date.now() - sentTimestamp;

    await interaction.editReply(`${randomPongMessage} (Ping: ${pingTime}ms)`);
  },
};

module.exports = {
  name: 'interactionCreate',
  once: false,
  run: async (client, moonlink, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      const { commandName } = interaction;
      const command = client.commands.get(commandName);

      if (!command) return;

      await command.execute(client, interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while running this command.', ephemeral: true });
    }
  },
};

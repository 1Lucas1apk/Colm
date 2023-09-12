const fs = require('fs');
const { Collection, REST, Routes } = require('discord.js');
const { clientId, token } = require('../config.js');

module.exports = {
  loadCommands: async (client) => {
    try {
      client.commands = new Collection();
      const commands = [];

      const commandFolders = fs.readdirSync('./src/commands');

      for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
          const command = require(`../commands/${folder}/${file}`);
          if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
          } else {
            console.log(`[ WARNINGv] The command at ${folder}/${file} is missing a required "data" or "execute" property.`);
          }
        }
      }

      client.commands.sort((a, b) => (a.priority || 0) - (b.priority || 0));

      const rest = new REST({ version: '10' }).setToken(token);

      console.log(`[ Application ]: Started refreshing ${commands.length} application (/) commands.`);

      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log(`[ Appliction ]: Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  },
};

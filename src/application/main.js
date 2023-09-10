const {
	Client
} = require('discord.js'); 
const { 
	MoonlinkManager
} = require('moonlink.js')
const config = require('../config.js');
const { 
	loadApplicationEvents,
	loadMoonlinkEvents
} = require('../handlers/events.js');
const {
	loadCommands
} = require('../handlers/commands.js');

const client = new Client({
	intents: 131071
})

client.moonlink = new MoonlinkManager(config.nodes, {}, (id, data) => {
	let guild = client.guilds.cache.get(id);
	if(guild) guild.shard.send(JSON.parse(data))
})

loadApplicationEvents(client)
loadMoonlinkEvents(client.moonlink)
loadCommands(client)

client.login(process.env['TOKEN'])

process.on('unhandledRejection', (error) => {
      console.error('Rejeição de promessa não tratada:', error);
});
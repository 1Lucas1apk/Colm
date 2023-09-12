const {
	Client
} = require('discord.js'); 
const { 
	MoonlinkManager,
	makeRequest
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
client.moonlink.on('trackStart', async (player, track) => {
    let spotifyTrack = await client.moonlink.spotify.fetch(player.current.title);
    let letrasResponse = await makeRequest(`${process.env['LYRICS']}?url=${spotifyTrack.tracks[0].url}`, {
        method: 'GET',
        headers: {
            "User-Agent": "Colm (Bot)"
        }
    });

    let letras = letrasResponse.lines;

    let msg = await client.channels.cache.get(player.textChannel).send('\nstarting letter system...');
    let letraIndex = 0;
    let ij = null;
    let t = setInterval(() => {
        const tempoAtualMs = client.moonlink.map.get('current')[player.guildId].position;
        while (letraIndex < letras.length && tempoAtualMs >= parseInt(letras[letraIndex].startTimeMs)) {
            letraIndex++;
        }

        if (letraIndex < letras.length && letras[letraIndex].words) {
            const letraFormatada = `letter:\n${letraIndex !== 0 && letraIndex >= 2 ? `${letras[letraIndex - 2].words}\n` : ''}**${letras[letraIndex - 1] ? letras[letraIndex - 1].words : ''}**\n**${letras[letraIndex] ? `${letras[letraIndex].words }` : '' }**\n${letras[letraIndex + 1] ? `${letras[letraIndex + 1].words}` : '' }`;
					  if(letraFormatada == ij) return;
					  ij = letraFormatada
            msg.edit(letraFormatada);
        } else {
            msg.edit("the lyrics may not be synced correctly");
            clearInterval(t);
        }
    }, 1000);
});

process.on('unhandledRejection', (error) => {
      console.error('Unhandled promise rejection:', error);
});
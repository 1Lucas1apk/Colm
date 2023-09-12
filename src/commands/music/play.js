const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song in your voice channel.')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Enter the song name or URL')
        .setRequired(true)),
  async execute(client, interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: "<:blobcatbughunter:1010977343474511983> I can't continue, you're not in a voice channel.",
        ephemeral: true
      });
    }

    const query = interaction.options.getString('song');
    const voiceChannelId = interaction.member.voice.channel.id;

    const player = client.moonlink.players.create({
      guildId: interaction.guild.id,
      voiceChannel: voiceChannelId,
      textChannel: interaction.channel.id
    });

    if (!player.connected) {
      player.connect({
        setDeaf: true,
        setMute: false
      });
    }

    const searchResult = await client.moonlink.search(query);

    switch (searchResult.loadType) {
      case "loadfailed":
        return interaction.reply({ content: "<:blobcatbughunter:1010977343474511983> Load failed." });
      case "empty":
        return interaction.reply({ content: "<:blobcatbughunter:1010977343474511983> No matches!" });
      case "playlist":
        await interaction.reply({
          content: `<:blobcatbughunter:1010977343474511983> ${searchResult.playlistInfo.name} - This playlist has been added to the waiting list`
        });
        for (const track of searchResult.tracks) {
          player.queue.add(track);
        }
        break;
      default:
        player.queue.add(searchResult.tracks[0]);
        await interaction.reply({
          content: `${searchResult.tracks[0].title} was added to the waiting list`
        });
        break;
    }
		
    if (!player.playing) {
      player.play();
		}
		
  },
};

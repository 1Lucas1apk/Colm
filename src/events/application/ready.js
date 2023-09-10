module.exports = {
  name: 'ready',
  once: true,
  run: (client, moonlink) => {
    console.log(`Application was logged in as: ${client.user.tag}`);
		moonlink.init(client.user.id);
  },
};

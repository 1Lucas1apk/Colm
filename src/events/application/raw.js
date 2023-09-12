module.exports = {
  name: 'raw',
  once: false,
  run: (client, moonlink, data) => {
		moonlink.packetUpdate(data);
  },
};
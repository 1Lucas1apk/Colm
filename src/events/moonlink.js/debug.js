module.exports = {
  name: 'debug',
  once: false,
  run: (client, moonlink, ...args) => {
		console.log(...args);
	},
};

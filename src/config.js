module.exports = {
	token: process.env['TOKEN'],
	nodes: [
		{
			host: process.env['LAVALINK_HOST'],
			port: 443,
			secure: process.env['LAVALINK_SECURE'],
			password: process.env['LAVALINK_PASSWORD'],
			identifer: process.env['LAVALINK_IDENTIFIER']
		}
	],
	clientId: process.env['CLIENTID']
}
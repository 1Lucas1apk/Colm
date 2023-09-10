const fs = require('fs');
const path = require('path');

function loadEvents(client, moonlink, eventsFolder) {
  const eventsPath = path.join(__dirname, eventsFolder);
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
      client.once(event.name, (...args) => event.run(client, moonlink, ...args));
    } else {
      client.on(event.name, (...args) => event.run(client, moonlink, ...args));
    }
  }
}

module.exports = {
  loadApplicationEvents: (client) => {
    loadEvents(client, client.moonlink, '../events/application');
  },
  loadMoonlinkEvents: (client) => {
    loadEvents(client, client.moonlink, '../events/moonlink.js');
  },
};

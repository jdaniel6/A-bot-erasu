const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({intents:[GatewayIntentBits.Guilds]});

client.once(Events.ClientReady, c => {
    console.log(`${c.user.tag} has logged into Discord`);
});

client.login(token);
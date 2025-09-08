const {Client, Events, GatewayIntentBits} = require('discord.js');
const {token} = require('./config.json');

const client = new Client({intents: [GatewayIntentBits.Guilds]});

//Waits for the client to be ready then notifies the console.
client.once(Events.ClientReady, readyClient => {
    console.log("Client Ready. Logged as ${readyClient.user.tag}");
});

//Logs the client in.
client.login(token);
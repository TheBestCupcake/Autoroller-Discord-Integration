

const {Client, Events, GatewayIntentBits} = require('discord.js');
const {token} = require('./config.json');

//New client instance.
const client = new Client({intents: [GatewayIntentBits.Guilds]});

//Check if client is running properly.
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});
//Logs client in as the bot.
client.login(token);


const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, Events, GatewayIntentBits, MessageFlags} = require('discord.js');
const {token} = require('./config.json');

const client = new Client({intents: [GatewayIntentBits.Guilds]});

//Loads all the commands from the file.
client.commands = new Collection();


//Waits for the client to be ready then notifies the console.
client.once(Events.ClientReady, readyClient => {
    console.log("Client Ready. Logged as ${readyClient.user.tag}");
});

//Logs the client in.
client.login(token);
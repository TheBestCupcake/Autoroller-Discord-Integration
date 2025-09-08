const {token} = require('./config.json');
const {Client, Collection, Events, GatewayIntentBits, MessageFlags} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

client.login(token);

client.on("messageCreate", async (message) => {
    console.log(message)

    if(!message?.author.bot){
        message.channelId.send('yes');
    }
});
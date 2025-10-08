const fs = require('node:fs');
const path = require('node:path');

const {Client, Collection, Events, GatewayIntentBits, MessageFlags} = require('discord.js');
const {token} = require('./config.json');

//New client instance.
const client = new Client({intents: [GatewayIntentBits.Guilds]});

//Parses through the commands file to register them all to this collection. This is serverside.
client.commands = new Collection(); 

//Finds each command file.
const foldersPath = path.join(__dirname, `commands`);
const commandFolder = fs.readdirSync(foldersPath);

for(const folder of commandFolder){
    const commandsPath = path.join(foldersPath, folder);
    const commandFile = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for(const file of commandFile){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[Warning] The command at ${filePath} is missing properties.`);
        }
    }
}

//Logs client in as the bot.
client.login(token);
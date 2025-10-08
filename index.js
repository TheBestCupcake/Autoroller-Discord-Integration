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

        //Adds command to the Collection if it is valid.
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[Warning] The command at ${filePath} is missing properties.`);
        }
    }
}


//Parses through and finds all events.
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for(const file of eventFiles){
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    //Runs the 'once' events a single time and leaves the others to be constantly active.
    if(event.once){
        client.once(event.name, (...args) => event.execute(...args));
    }
    else{
        client.on(event.name, (...args) => event.execute(...args));
    }
}





//Logs client in as the bot.
client.login(token);
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

//Gets the path to the commands file.
const folderPath = path.join(__dirname, 'commands');
//Returns an array of all folders inside the commands folder.
const commandFolder = fs.readdirSync(folderPath);

for(const folder of commandFolder){
    //Goes through each folder and finds the files that end with .js.
    const commandPath = path.join(folderPath, folder);
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));

    for(const file of commandFiles){
        //gets the command file path.
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        //Sets a new command in the commands collection.
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        }
        else{
            console.log("[Warning] File does not have the 'data' or 'execute' properties.")
        }
    }
}



//Logs the client in.
client.login(token);
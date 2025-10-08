const {REST, Routes} = require('discord.js');
const {clientId, guildId, token} = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Console } = require('node:console');

const commands = [];


//Finds each command file.
const foldersPath = path.join(__dirname, 'commands');
const commandFolder = fs.readdirSync(foldersPath);

for(const folder of commandFolder){
    const commandsPath = path.join(foldersPath, folder);
    const commandFile = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for(const file of commandFile){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if('data' in command && 'execute' in command){
            commands.push(command.data.toJSON());
        }
        else{
            console.log(`[Warning] The command at ${filePath} is missing properties.`);
        }
    }
}
//Construct a RESTful module instance.
const rest = new REST().setToken(token);

//Used to register all the commands on the server.
(async () => {
    try{
        console.log("Started refreshing commands");


        const data = await rest.put(Routes.applicationCommands(clientId), { body: commands });

        console.log("Registered Commands");
    }
    catch (error){
        console.error(error);
    }
})();
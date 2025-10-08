const fs = require('node:fs');
const path = require('node:path');

const {Client, Collection, Events, GatewayIntentBits, MessageFlags} = require('discord.js');
const {token} = require('./config.json');

//New client instance.
const client = new Client({intents: [GatewayIntentBits.Guilds]});

//Check if client is running properly.
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});
//Logs client in as the bot.
client.login(token);


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


//Executes any interactions. Also returns errors if wrong.
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return; 
	
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error(`Command ${command} does not exist.`);
        return;
    }

    try{
        await command.execute(interaction);
    }
    catch(error){
        console.error(error);
        if(interaction.replied || interaction.deferred){
            await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
        }
        else{
            await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
        }
    }

});
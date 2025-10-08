const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription('Reloads commands.')
    .addStringOption((option) => option.setName('command').setDescription('The command to reload').setRequired(true)),
    async execute(interaction){
        const commandName = interaction.option.getString('command', true).toLowerCase();
        const command = interaction.client.comamnds.get(commandName);

        if(!command){
            return interaction.reply("Command does not exist.");
        }

        //Deletes the file from the cache and replaces it with the new file.
        delete require.cache[require.resolve(`./${command.data.name}.js`)];

        try {
	        const newCommand = require(`./${command.data.name}.js`);
	        interaction.client.commands.set(newCommand.data.name, newCommand);
        	await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
        	console.error(error);
        	await interaction.reply(
        		`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
        	);
        }
    },
};
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('Roll').setDescription('Rolls your dice.'),
    async execute(interaction) {
        await interaction.reply("Rolled.");
    },
};
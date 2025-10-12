const {ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, UserSelectMenuBuilder, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder} = require('discord.js');
const { response } = require('express');

module.exports = {
    data: new SlashCommandBuilder().setName('roll').setDescription('Rolls your dice.'),
	async execute(interaction) {

		const container = new ContainerBuilder()
		.setAccentColor(0x0099ff)
		.addTextDisplayComponents((textDisplay) =>
			textDisplay.setContent(
				"Text Inside the text container."
			),
		)
		.addActionRowComponents((actionRow) =>
			actionRow.setComponents(new UserSelectMenuBuilder().setCustomId('exampleSelect').setPlaceholder('Select users')),
		)
		.addSeparatorComponents((separator) => separator)



		await interaction.reply({
			components: [container],
			flags: MessageFlags.IsComponentsV2,
		});
	},
};
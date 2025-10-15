const {ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, SlashCommandBuilder, InteractionCollector, ModalBuilder, TextInputBuilder, TextInputStyle, Message} = require('discord.js');
const { response } = require('express');

module.exports = {
    data: new SlashCommandBuilder().setName('roll').setDescription('Rolls your dice.'),
	async execute(interaction) {

		//Modal.
		const autoModal = new ModalBuilder().setCustomId("autorollerModal").setTitle("Autoroller");

		//Components.
		const numOfAttacksInput = new TextInputBuilder()
		.setCustomId("numAtkInput")
		.setLabel("Enter Number of Attacks.")
		.setStyle(TextInputStyle.Short);
		const numOfAttacksRow = new ActionRowBuilder().addComponents(numOfAttacksInput);

		const acToBeatInput = new TextInputBuilder()
		.setCustomId("acInput")
		.setLabel("Enter Enemy AC.")
		.setStyle(TextInputStyle.Short);
		const acToBeatRow = new ActionRowBuilder().addComponents(acToBeatInput);





		autoModal.addComponents(numOfAttacksRow, acToBeatRow);


		console.log(autoModal.toJSON());


		await interaction.showModal(autoModal);

	},
};
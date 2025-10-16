const { Events, MessageFlags } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction){
        if (interaction.isModalSubmit()) {
            switch(interaction.customId) {
                case "autorollerModal":{
                    const numAtk = interaction.fields.getTextInputValue('numAtkInput');
					const ac = interaction.fields.getTextInputValue('acInput');
					const atkMod = interaction.fields.getTextInputValue('atkMod');
					const dmgMod = interaction.fields.getTextInputValue('dmgMod');
					const diceSize = interaction.fields.getTextInputValue('diceSize');

                    //Autoroller logic.

                    //Reply
                    await interaction.reply({content: "autoroller results here."})
                }
            }
        }



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
    }
}
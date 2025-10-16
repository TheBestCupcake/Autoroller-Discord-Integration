const { Events, MessageFlags } = require('discord.js');
const path = require('path');
const { spawn } = require('child_process');

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
                    const python = spawn('python', [path.join(__dirname, 'autoroller.py'),
                        'autoroller.py',
                        numAtk,
                        ac,
                        atkMod,
                        dmgMod,
                        diceSize
                    ]);

                    let result = '';
                    python.stdout.on('data', (data) => {
                        result += data.toString();
                    });

                    python.stderr.on('data', (data) => {
                        console.error(`Python error: ${data}`);
                    });


                    

                    //Reply
                    python.on('close', async (code) => {
                        try {
                            const parsed = JSON.parse(result);
                            const reply = `🎯 **Auto Roller Results** 🎲\n${parsed.output}\n\n**Total Damage:** ${parsed.totalDamage}\n**Crits:** ${parsed.crits}\n**Hits:** ${parsed.hits}\n**Misses:** ${parsed.misses}`;

                            await interaction.reply({ content: reply });
                        } catch (err) {
                            console.error("Failed to parse Python output:", err);
                            await interaction.reply({ content: "Error running autoroller." });
                        }
                    });
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
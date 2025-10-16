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

                    
                    await interaction.deferReply();

                    const scriptPath = path.join(__dirname, '..', 'server-side-logic', 'autoroller.py');


                    console.log("before path.")
                    //Autoroller logic.
                    const python = spawn('python', [scriptPath,
                        numAtk,
                        ac,
                        atkMod,
                        dmgMod,
                        diceSize
                    ]);
                    console.log("Reached after path.")

                    let stdoutData = '';
                    let stderrData = '';

                    python.stdout.on('data', (data) => {
                        stdoutData += data.toString();
                    });

                    python.stderr.on('data', (data) => {
                        stderrData += data.toString();
                    });

                    python.on('close', async (code) => {
                        if (stderrData) {
                            console.error(`Python error: ${stderrData}`);
                            await interaction.editReply({ content: `⚠️ Python error:\n${stderrData}` });
                            return;
                        }

                        try {
                            // Trim any stray whitespace before parsing
                            const parsed = JSON.parse(stdoutData.trim());
                            const reply = `🎯 **Auto Roller Results** 🎲
**Total Damage:** ${parsed.totalDamage}
**Crits:** ${parsed.crits}
**Hits:** ${parsed.hits}
**Misses:** ${parsed.misses}`;

                            interaction.editReply({ content: reply });
                            return;
                        } catch (err) {
                            console.error("Failed to parse Python output:", err);
                            console.log("Raw Python output:", stdoutData);
                            interaction.editReply({ content: "❌ Failed to parse Python output. Check console for details." });
                            return;
                        }
                    });
                    break;
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
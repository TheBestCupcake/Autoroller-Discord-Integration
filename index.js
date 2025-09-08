const {token} = require('./config.json');
const {Client, Collection, Events, GatewayIntentBits, MessageFlags} = require('discord.js');
const bodyParser = require('body-parser');
const express = require('express');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

client.login(token);

//Send message function.
const sendMessage = (channelID, message) => {
    const channel = client.channels.cache.get(channelID);
    if(channel){
        channel.send(message);
    }
    else{
        console.error("Channel not found.");
    }
};


//Sets up the express server.
const app = express();
app.use(bodyParser.json());

//Sends a message with the rolled values. Takes a JSON of the channel id and the string as inputs. 
app.post('/roll', (request, res) => {
    const {channelID, message} = request.body;
    if(!channelID || !message) {
        return res.status(400).send({error: 'Missing values'});
    }

    sendMessage(channelID, message);

    res.send({ status: 'Message sent successfully' });

})

//Listens to this local server.
app.listen(5000, () => {
    console.log('Server listening on http://localhost:5000');
});
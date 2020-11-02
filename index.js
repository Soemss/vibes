const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const command = require('./command')

require('dotenv').config()

client.on('ready', () => {
    console.log('Music go brrr')

    command(client, 'ping', message => {
        message.channel.send('Pong!')
    })
})

client.login(process.env.TOKEN);

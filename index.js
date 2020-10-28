const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const command = require('./command')
require('dotenv').config();

client.on('ready', () => {
    console.log('The client is ready')
    command(client, ['ping', 'test'], (message) => {
        message.channel.send('Pong!')
    })
})

Discord.Client().login(process.env.DJS_TOKEN)

const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()

client.on('ready', () => {
    console.log('Music go brrr')
})

client.login(process.env.TOKEN)
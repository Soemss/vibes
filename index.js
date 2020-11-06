const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()

client.on('ready', () => {
    console.log('Music go brrr')
     
})

client.on("message", message => {
    const prefix = '<'
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    if(command === 'play') {
        console.log("Now playing " + args[0])
    }
})

client.login(process.env.TOKEN)
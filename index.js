const Discord = require('discord.js')
const client = new Discord.Client()
const command = require('./command')

client.on('ready', () => {
    console.log('The client is ready')
    command(client, ['ping', 'test'], (message) => {
        message.channel.send('Pong!')
    })
})

console.log(client.login(process.env.TOKEN))

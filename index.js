const Discord = require('discord.js');
const client = new Discord.Client();
const queue = new Map();

client.on('ready', () => {
    console.log('Music go brrr');
     
})

client.on("message", message => {
    const prefix = '<';

    const serverQueue = queue.get(message.guild.id);

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.toLowerCase();

    if(command === 'play') {
        execute(message, serverQueue);
    }

    async function execute(message, serverQueue) {
        let vc = message.member.voice.channel;
        if(!vc) {
            return message.channel.send("You are not in a voice chat.");
        
        } else {
            //
        }
    }
})

client.login(process.env.TOKEN)
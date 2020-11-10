const { executionAsyncResource } = require('async_hooks');
const Discord = require('discord.js');
const client = new Discord.Client();
const queue = new Map();
const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');
// searcher for searching songs through youtube api
const searcher = new YTSearcher({
    key: "AIzaSyDM4F1Nk-jz5nadGYLzLFqWxewZ8qJ7rag",
    revealed: true
});

// on bot deployment logs string
client.on('ready', () => {
    console.log('Music go brrr');
    client.user.setPresence({ game: { name: 'Type "<help" for a list of commands' }, status: 'online' })
})


client.on("message", message => {

    const prefix = '<';

    const serverQueue = queue.get(message.guild.id);

    // if user message starts with prefix, returns
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // slices the message, trims, then splits it for yt api
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'play':
            execute(message, serverQueue);
            break;
        case 'stop':
            stop(message, serverQueue);
            break;
        case 'skip':
            skip(message, serverQueue);
            break;
        case 'info':
            stop(message, serverQueue);
            break;
        case 'pause':
            pause(message, serverQueue);
            break;
        case 'resume':
            resume(message, serverQueue);
            break;
    }
    

    // function for checking if user is in vc, then returns a string if not.
    async function execute(message, serverQueue) {
        let vc = message.member.voice.channel;
        if(!vc) {
            return message.channel.send("You are not in a voice chat.");
        
        } else {
            // searches request through ytdl & yt api 
            let result = await searcher.search(args.join(" "), { type: "video" })
            const songInfo = await ytdl.getInfo(result.first.url);

            // song title & url
            let song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            };

            // if server queue empty, creates queue
            if(!serverQueue) {
                const qConstructor = {
                    textChannel: message.channel,
                    voiceChannel: vc,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                    loop: false,
                };
                queue.set(message.guild.id, qConstructor);
                qConstructor.songs.push(song);

                try{
                    let connection = await vc.join();
                    qConstructor.connection = connection;
                    play(message.guild, qConstructor.songs[0]);
                } catch (err) {
                    console.error(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(`Unable to join the voice channel ${err}`);
                }
            } else {
                serverQueue.songs.push(song);
                return message.channel.send(`**Adding** \`${song.title}\` **to the queue** ${song.url}`);
            }
        }
    }
    function play(guild, song) {
        const serverQueue = queue.get(guild.id);
        if(!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on('finish', () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            serverQueue.textChannel.send(`🎵 **Now playing**: \`${serverQueue.songs[0].title}\` ${serverQueue.songs[0].url}`)
        
    }
    
    function stop (message, serverQueue) {
        if(!message.member.voice.channel)
            return message.channel.send("You need to join the voice channel")
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        serverQueue.textChannel.send(`👋 **Disconnected**`)
    }

    function skip (message, serverQueue) {
        if(!message.member.voice.channel)
            return message.channel.send("You need to join the voice channel");
        if(!serverQueue)
            return message.channel.send("There is nothing to skip");
        serverQueue.connection.dispatcher.end();
    }

    function info (message, serverQueue) {
        return serverQueue.textChannel.send(
            `**Vibes Music Bot**
            Developed by **Soems** :)
            `
            );
    }

    function pause (message, serverQueue) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send("⏸ **Music Paused**");
        }
    }

    function resume (message, serverQueue) {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send('▶ **Music Resumed**');
        }
    }
})

// gets token from heroku
client.login(process.env.TOKEN)
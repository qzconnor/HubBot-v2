const { Command } = require('discord.js-commando');
const ytdl = require("ytdl-core");
const { MessageEmbed } = require('discord.js');
const YouTube = require("youtube-sr");
module.exports = class MuiscPlayer extends Command{
    constructor(client){
        super(client, {
            name:'play',
            group:'music',
            aliases: ["p"],
            memberName:'mp',
            description:'plays videos from youtube',
            argsType: 'multiple'
        });
    }

    async run(message, args){
        const serverQueue = this.client.queue.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel){
            let embed = new MessageEmbed()
            .setTitle("Fehler - Du musst dich in einem Voice Channel befinden!")
            .setColor(this.client.errorColor)
            return message.say(embed)
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has("CONNECT") || !permissions.has("SPEAK")){
            let embed = new MessageEmbed()
            .setTitle("Fehler - Keine Rechte um dem Voice Channel oder Zu Sprechen!")
            .setColor(this.client.errorColor)
            return message.say(embed);
        }
        if(args.length == 0){
            let embed = new MessageEmbed()
            .setTitle("Fehler - Bitte gebe eine gültige URL an!")
            .setColor(this.client.errorColor)
            return message.say(embed);
        }

        let URL;
        if (message.content.includes("http://") || message.content.includes("https://")) {
            URL = args[0];
        }else{
            message.say("🔍 **Suche nach** `" + args.join(" ") + "...` \n`Kann ein paar Sekunden Dauern...`");
            let query = await YouTube.searchOne(args.join(" "));
            URL = "https://www.youtube.com/watch?v=" + query.id;
        }
        
        const songInfo = await ytdl.getInfo(URL);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url,
            channel: songInfo.videoDetails.ownerChannelName,
            views: songInfo.videoDetails.viewCount,
            length: songInfo.videoDetails.lengthSeconds
        }
        if(!serverQueue){
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            }

            this.client.queue.set(message.guild.id, queueConstruct);

            queueConstruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                message.delete();
                this.playSong(message.guild, queueConstruct.songs[0]);
            } catch( err ){
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
            }


        }else{
            serverQueue.songs.push(song);
    
            let songemb = new MessageEmbed();
            songemb.setTitle(`Zur Warteschlange hinzugefügt: **${song.title}**`);
            songemb.addField("Channel:", song.channel, true);
            songemb.addField("Views:", new Intl.NumberFormat('de-DE').format(song.views), true);
            songemb.setURL(song.url);
            songemb.setColor(this.client.succesColor);
            songemb.setThumbnail(song.thumbnail);
            return message.channel.send(songemb);
        }

       

    }
    playSong(guild, song) {
        const serverQueue = this.client.queue.get(guild.id);
        if (!song) {
          serverQueue.voiceChannel.leave();
          this.client.queue.delete(guild.id);
          return;
        }
        console.log("Spielt: " + song.title + " auf " + guild.name);

        const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          serverQueue.songs.shift();
          this.playSong(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

      let songemb = new MessageEmbed();
      songemb.setTitle(`Spielt: **${song.title}**`);
      songemb.addField("Channel:", song.channel, true);
      songemb.addField("Views:", new Intl.NumberFormat('de-DE').format(song.views), true);
      songemb.setURL(song.url);
      songemb.setColor(this.client.succesColor);
      songemb.setThumbnail(song.thumbnail);
      serverQueue.textChannel.send(songemb);
    }
}
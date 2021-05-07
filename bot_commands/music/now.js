const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class NowCommand extends Command{
    constructor(client){
        super(client,{
            name: 'now',
            aliases: ['np', "n"],
            group: 'music',
            memberName: 'now',
            description: 'Now Command.'
        })
    }

    async run(message){
        const serverQueue = this.client.queue.get(message.guild.id);


        if (!message.member.voice.channel){
            let embed = new MessageEmbed()
            .setTitle("Fehler - Du musst dich in einem Voice Channel befinden!")
            .setColor(this.client.errorColor)
            return message.say(embed);
        }

       var song = serverQueue.songs[0]; 

       let songemb = new MessageEmbed();

       songemb.setTitle(`Aktueller Song: **${song.title}**`);
       songemb.addField("Channel:", song.channel, true);
       songemb.addField("Views:", new Intl.NumberFormat('de-DE').format(song.views), true);
       songemb.addField("Länge:", format(song.length));
       songemb.setURL(song.url);
       songemb.setColor(this.client.succesColor);
       songemb.setThumbnail(song.thumbnail);
       return message.channel.send(songemb);

    }



 


}

function format(time) {   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
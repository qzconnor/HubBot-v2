const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class JoinCommand extends Command{
    constructor(client){
        super(client,{
            name: 'queue',
            aliases: ['q'],
            group: 'music',
            memberName: 'queue',
            description: 'Queue Command.'
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

       if(serverQueue.songs && serverQueue) {
           for(var song of serverQueue.songs){
               console.log(song)
           }
       }
    }
}
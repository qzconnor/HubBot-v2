const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class JoinCommand extends Command{
    constructor(client){
        super(client,{
            name: 'stop',
            aliases: ['dis', "leave"],
            group: 'music',
            memberName: 'stop',
            description: 'Stop Command.'
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
        message.delete();
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        message.say("👋");

    }
}
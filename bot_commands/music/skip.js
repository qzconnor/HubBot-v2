const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class CatCommand extends Command{
    constructor(client){
        super(client, {
            name: 'skip',
            aliases: ["jump"],
            group: 'music',
            memberName: 'skip',
            description: 'Überspring einen Song',
        });
    }

    async run(message){

        const serverQueue = this.client.queue.get(message.guild.id);

        if (!message.member.voice.channel){
            let embed = new MessageEmbed()
            .setTitle("Fehler - Du musst dich in einem Voice Channel befinden!")
            .setColor(this.client.errorColor)
            return message.say(embed);
        }
        if (!serverQueue){
            let embed = new MessageEmbed()
            .setTitle("Fehler - Nichts zum Überspringen vorhanden!")
            .setColor(this.client.errorColor)
            return message.say(embed);
        }
        message.delete();
        serverQueue.connection.dispatcher.end();
    }
}
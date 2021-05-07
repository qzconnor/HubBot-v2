const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = class CatCommand extends Command{
    constructor(client){
        super(client, {
            name: 'dog',
            aliases: ["hund", "dok"],
            group: 'misc',
            memberName: 'dog',
            description: 'Zeigt eine Zufällige katze',
            argsCount: 0
        });
    }

    async run(msg){
        const { message } = await fetch('https://dog.ceo/api/breeds/image/random').then(response => response.json());
        let dogem = new MessageEmbed()
        .setTitle(`${msg.author.tag} hier ein Hunde Bild!`)
        .setURL(message)
        .setImage(message)
        .setColor(this.client.succesColor)
        msg.embed(dogem);
    }
}
const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = class CatCommand extends Command{
    constructor(client){
        super(client, {
            name: 'cat',
            aliases: ["katze", "kat"],
            group: 'misc',
            memberName: 'cat',
            description: 'Zeigt eine Zufällige katze',
            argsCount: 0
        });
    }

    async run(msg){
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
        let catem = new MessageEmbed()
        .setTitle(`${msg.author.tag} hier ein Katzen Bild!`)
        .setURL(file)
        .setImage(file)
        .setColor(this.client.succesColor)
        msg.embed(catem);
    }
}
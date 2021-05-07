const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class AvatarCommand extends Command{
    constructor(client){
        super(client,{
            name: 'avatar',
            aliases: ["pp", "av"],
            group: 'misc',
            memberName: 'avatar',
            description: 'Zeigt Profil Bild von einem User',
            args: [
                {
                    type: "user",
                    prompt: "Von wem möchtest du das Profil Bild sehen?",
                    key:"user"
                }
            ]
        })
    }

    async run(msg, { user }){
        let embed = new MessageEmbed()
        .setTitle(`${user.tag}s Profil Bild!`)
        .setURL(user.displayAvatarURL())
        .setImage(user.displayAvatarURL())
        .setColor("#de2810")
        msg.embed(embed);
    }
}
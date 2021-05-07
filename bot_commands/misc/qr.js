const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class CatCommand extends Command{
    constructor(client){
        super(client, {
            name: 'qr',
            group: 'misc',
            memberName: 'qr',
            description: 'Generates a QR Code',
            argsType: 'single'
        });
    }
    async run(message, args){

        const body = {
            "frame_name": "no-frame",
            "qr_code_text": "https://www.qr-code-generator.com/",
            "image_format": "PNG",
            "qr_code_logo": "scan-me-square"
        }


        fetch('https://api.qr-code-generator.com/v1/create/', 
        { 
            method: 'POST', 
            body: JSON.stringify(body)
        })
        .then(res => console.log(res))



        message.delete();
    }
}
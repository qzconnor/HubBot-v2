const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const RainbowSixApi = require('rainbowsix-api-node');
const R6 = new RainbowSixApi();

module.exports = class TestCommand extends Command {
    constructor(client){
        super(client, {
            name: 'r6',
            aliases: ['r6stats'],
            group: 'misc',
            memberName: 'r6',
            description: 'Stats Command for r6',
            argsType: 'multiple'
        });
    }
        async run(message, args) {
            if(args.length != 2){
                return;
            }

            var username = args[0];
            var platform = args[1];

            R6.stats(username, platform).then(response => {
                console.log(response);
            }).catch(error => {
                console.error(error)
            });

        }
    
}
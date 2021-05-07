const { Command } = require('discord.js-commando');

module.exports = class TestCommand extends Command {
    constructor(client){
        super(client, {
            name: 'apitest',
            aliases: ['at'],
            group: 'test',
            memberName: 'apitest',
            description: 'Api Test Command.',
            userPermissions: ['ADMINISTRATOR']
        });
    }
        async run(message) {
            message.say('Test!');
        }

}
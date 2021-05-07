const { CommandoClient } = require('discord.js-commando');
const { Collection } = require('discord.js');
const path = require('path');

module.exports = class BotClient extends CommandoClient{
    constructor(options = {}){
        super({
            commandPrefix: options.prefix
        });

        this.validate(options);

        this.queue = new Collection();

        this.errorColor = "#de2810";
        this.succesColor = "#3dd91a"

        this.registry
            .registerDefaultTypes()
            .registerGroups([
                ['music', 'Music Group'],
                ['play', 'Play Group'],
                ['test', 'Test Group'],
                ['misc', 'Misc Group']
            ])
            .registerDefaultGroups()
            .registerDefaultCommands({
                help: false
            })
            .registerCommandsIn(path.join(__dirname, 'bot_commands'));


            this.once('ready', () => {
                console.log(`Logged in as ${this.user.username}`);
                this.user.setStatus('dnd')
                this.user.setActivity(`mit ${this.guilds.cache.size} Servern | ${this.prefix}`, {type: 1});
            });
    }
    validate(options){
        if(typeof options !== 'object') throw new TypeError('Options not typ of Object!');

        if(!options.token) throw new Error('No Token!');

        this.token = options.token;

        if(!options.prefix)  throw new Error('No Prefix!');

        if(typeof options.prefix !== 'string') throw new TypeError('Prefix not typ of String!');
        this.prefix = options.prefix;
    }

    async start(token = this.token){
        super.login(token);
    }
}
const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const fs = require('fs')

module.exports = class TestCommand extends Command {
    constructor(client){
        super(client, {
            name: 'stats',
            aliases: ['fnstats'],
            group: 'misc',
            memberName: 'stats',
            description: 'Stats Command.',
            argsType: 'multiple'
        });
    }
        async run(message, args) {
            var platform = "pc";
            const stats = await fetch(`https://api.fortnitetracker.com/v1/profile/${platform}/${args[0]}`,{
                method: 'GET',
                headers: {
                    "TRN-Api-Key": "0ec7bb4b-0397-436f-a330-4f1cd9ea4ceb",
                    "Content-Type": "application/json"
                  }
            }).then(response => response.json());

            this.storeData(stats.stats, `./${args[0]}.json`)

            console.log(stats.stats.kd);
            console.log(stats.stats.winRatio);
            console.log(stats.stats.matches);
            console.log(stats.stats.kills);
            console.log(stats.stats.top2);
        }
        storeData = (data, path) => {
            try {
              fs.writeFileSync(path, JSON.stringify(data, null, 4))
            } catch (err) {
              console.error(err)
            }
          }
}
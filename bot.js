const Bot = require('./Client.js');


const config = require('./config.json');

const client = new Bot(config);

client.start();
const { prefix } = require('./config.json')

// ['ping', 'test']

// 'ping'

module.exports = (client, aliases, callback) => {

    client.on('message', message => {
        const { content } = message;
    })
}
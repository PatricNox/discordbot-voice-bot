const { handleUserSpeaking } = require('../utils/audioUtils');
const { getRandomGreeting, speak } = require('../utils/speakUtils');

async function joinAndListen(channel, connectToChannel) {
    try {
        const connection = await connectToChannel(channel);
        console.log('The bot has connected to the channel!');
        await speak(connection, getRandomGreeting());

        const receiver = connection.receiver;
        receiver.speaking.on('start', userId => handleUserSpeaking(receiver, userId, connection));

        // Add a listener to handle when the bot is disconnected
        connection.on('disconnected', () => {
            console.log('Disconnected from the channel');
            joinAndListen(channel, connectToChannel); // Attempt to rejoin the channel
        });

        return connection;
    } catch (error) {
        console.error('Connection error:', error);
        return;
    }
}

module.exports = {
    joinAndListen
};

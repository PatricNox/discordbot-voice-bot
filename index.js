const { configDotenv } = require('dotenv');
configDotenv();

const client = require('./core/client');
const { Events } = require('discord.js');
const { checkVoiceChannels, connectToChannel } = require('./handlers/voice');
const { joinAndListen } = require('./handlers/speechHandler');
const { initializeSodium, initializeVoskModel } = require('./utils/voskUtils');
const { printDependencyReport } = require('./utils/audioUtils');
const { discordToken } = require('./core/config');

let currentChannel = null;

// Initialize dependencies
(async () => {
    await initializeSodium();
    await initializeVoskModel();
    printDependencyReport();
})();

client.once(Events.ClientReady, () => {
    console.log('Bot is ready!');
    checkVoiceChannels(client, currentChannel, setCurrentChannel, (channel) => joinAndListen(channel, connectToChannel));
});

client.login(discordToken);

// Utility to set the current channel
function setCurrentChannel(channel) {
    currentChannel = channel;
}

// Prevent the bot from exiting unexpectedly
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
});

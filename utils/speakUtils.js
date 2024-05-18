const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const gtts = require('node-gtts')('sv');
const { greetings } = require('../core/config');

function getRandomGreeting() {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

async function speak(connection, text, originText = null) {
    if (!text) return;
    if (originText) {
        console.log(`Responding to: ${originText}`);
    }

    gtts.save('node_modules/output.mp3', text, (err) => {
        if (err) {
            console.error('Error generating TTS:', err);
            return;
        }

        const player = createAudioPlayer();
        const resource = createAudioResource('node_modules/output.mp3');
        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, () => console.log('The bot is playing the TTS message.'));
        player.on(AudioPlayerStatus.Idle, () => console.log('Finished playing TTS message.'));
        player.on('error', error => console.error('Error playing TTS message:', error));
    });
}

module.exports = {
    getRandomGreeting,
    speak
};

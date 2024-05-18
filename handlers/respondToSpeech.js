const { speak, getRandomGreeting } = require('../utils/speakUtils');
const { askGPT } = require('./gptHandler');
const responses = require('../responses.json');

async function handleSpeak(connection, response, originText, txt = "" ) {
    if (Array.isArray(response)) {
        // If response is an array, select a random variation
        const randomResponse = response[Math.floor(Math.random() * response.length)];
        await speak(connection, randomResponse, originText);
    } else if (response === 'getRandomGreeting') {
        await speak(connection, getRandomGreeting(), originText);
    } else if (response === 'askGPT') {
        const answer = await askGPT(txt);
        await speak(connection, answer, originText);
    }
}

async function respondToSpeech(txt, connection, currentChannel, setCurrentChannel, originText = null) {
    try {
        for (const [pattern, response] of Object.entries(responses)) {
            if (new RegExp(pattern, 'i').test(txt)) {
                await handleSpeak(connection, response, originText, txt);
                if (pattern === 'olga dra' || pattern === 'olga gå iväg') {
                    setTimeout(() => {
                        if (currentChannel) {
                            currentChannel.destroy();
                            currentChannel = null;
                        }
                    }, 5000);
                    setTimeout(() => {
                        checkVoiceChannels();
                    }, 1800000);
                } else if (pattern === 'olga käften' || pattern === 'olga tyst') {
                    if (currentSpeechProcess) {
                        currentSpeechProcess.kill('SIGTERM');
                        currentSpeechProcess = null;
                    }
                }
                return; // Exit loop once a match is found and handled
            }
        }

        // If no match found but 'olga' is mentioned
        if (txt.includes('olga')) {
            const answer = await askGPT(txt);
            await speak(connection, answer, originText);
        }
    } catch (error) {
        console.error('Error in respondToSpeech:', error);
    }
}

module.exports = {
    respondToSpeech
};

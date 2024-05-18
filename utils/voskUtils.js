const sodium = require('libsodium-wrappers');
const vosk = require('vosk');
const path = require('path');
const { modelPath, sampleRate } = require('../core/config');
const { respondToSpeech } = require('../handlers/respondToSpeech');

async function initializeSodium() {
    await sodium.ready;
    console.log('libsodium-wrappers initialized');
}

async function initializeVoskModel() {
    vosk.setLogLevel(0);
    try {
        const model = new vosk.Model(path.resolve(__dirname, '../', modelPath));
        console.log(`Vosk model loaded from ${modelPath}`);
        global.voskModel = model; // Make the model globally accessible
    } catch (err) {
        console.error(`Failed to load Vosk model from ${modelPath}`, err);
        process.exit(1);
    }
}

async function processAudioData(audioData, userId, connection, currentChannel, setCurrentChannel) {
    if (audioData.length === 0) {
        console.error('Received empty audio data');
        return;
    }

    const recognizer = new vosk.Recognizer({ model: global.voskModel, sampleRate });

    try {
        recognizer.acceptWaveform(audioData);
        const result = recognizer.finalResult();
        const txt = result.text.toLowerCase();
        await respondToSpeech(txt, connection, currentChannel, setCurrentChannel, result.text);
    } catch (error) {
        console.error('Error during speech recognition:', error);
    } finally {
        recognizer.free();
    }
}

module.exports = {
    initializeSodium,
    initializeVoskModel,
    processAudioData
};

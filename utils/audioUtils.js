const { opus } = require('prism-media');
const { spawn } = require('child_process');
const { EndBehaviorType } = require('@discordjs/voice');
const { processAudioData } = require('./voskUtils');

function handleUserSpeaking(receiver, userId, connection, currentChannel, setCurrentChannel) {
    const opusStream = receiver.subscribe(userId, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 500,
        },
    });

    const decoder = new opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 });
    const pcmStream = opusStream.pipe(decoder);

    const ffmpegProcess = spawn('ffmpeg', [
        '-f', 's16le',
        '-ar', '48000',
        '-ac', '2',
        '-i', 'pipe:0',
        '-f', 's16le',
        '-ar', '16000',
        '-ac', '1',
        'pipe:1'
    ]);

    const audioBuffer = [];
    pcmStream.pipe(ffmpegProcess.stdin);

    ffmpegProcess.stdout.on('data', chunk => audioBuffer.push(chunk));
    ffmpegProcess.stdout.on('end', () => {
        if (audioBuffer.length > 0) {
            const audioData = Buffer.concat(audioBuffer);
            processAudioData(audioData, userId, connection, currentChannel, setCurrentChannel);
        } else {
            console.error('Received empty audio buffer');
        }
    });

    ffmpegProcess.on('error', err => console.error('FFmpeg process error:', err));
    pcmStream.on('error', err => console.error('PCM stream error:', err));
}

function printDependencyReport() {
    console.log(require('@discordjs/voice').generateDependencyReport());
}

module.exports = {
    handleUserSpeaking,
    printDependencyReport
};

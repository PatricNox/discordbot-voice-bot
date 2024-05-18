const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');

async function checkVoiceChannels(client, currentChannel, setCurrentChannel, joinAndListenCallback) {
    const guilds = client.guilds.cache;

    for (const [guildId, guild] of guilds) {
        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2); // type 2 is for voice channels

        for (const [channelId, channel] of voiceChannels) {
            if (channel.members.size > 0) {
                try {
                    const joinedChannel = await joinAndListenCallback(channel);
                    console.log(`Joined voice channel: ${channel.name}`);
                    setCurrentChannel(joinedChannel);
                    checkIfAlone(currentChannel, client, setCurrentChannel, joinAndListenCallback);
                    return; // Exit the function once a channel is joined
                } catch (error) {
                    console.error(`Error joining voice channel: ${channel.name}`, error);
                }
            }
        }
    }

    console.log('No active voice channels found. Trying again in 10 minutes.');
    setTimeout(() => checkVoiceChannels(client, currentChannel, setCurrentChannel, joinAndListenCallback), 10 * 60 * 1000); // Retry in 10 minutes
}

function checkIfAlone(currentChannel, client, setCurrentChannel, joinAndListenCallback) {
    if (!currentChannel) return;

    const botMember = currentChannel.members.get(client.user.id);
    if (currentChannel.members.size === 1 && botMember) {
        console.log(`Alone in voice channel: ${currentChannel.name}. Leaving and looking for other channels.`);
        currentChannel.destroy();
        setCurrentChannel(null);
        checkVoiceChannels(client, currentChannel, setCurrentChannel, joinAndListenCallback);
    } else {
        console.log(`Not alone in voice channel: ${currentChannel.name}. Checking again in 5 minutes.`);
        setTimeout(() => checkIfAlone(currentChannel, client, setCurrentChannel, joinAndListenCallback), 5 * 60 * 1000); // Check again in 5 minutes
    }
}

async function connectToChannel(channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}

module.exports = {
    checkVoiceChannels,
    checkIfAlone,
    connectToChannel
};

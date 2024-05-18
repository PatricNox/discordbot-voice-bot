# DiscordJS Talk2Bot


> A discordjs project integrating with GROQ AI Models to have a bot with you in the voice
> channel. This bot can reply to you as you speak to it and can perform actions for you if you
> add support to it.


## Examples

```
(USER): Olga, what is 44+42
(BOT TTS): 44+42 is 86!


(USER): Olga, create a discord channel called "test"
(BOT TTS): OK, created

```

For custom commands, check `responses.json` and implement accordingly in `handlers/respondToSpeech.js`

## Setup

### Dependencies


* [ffmpeg](https://gyan.dev/ffmpeg/builds/)
* [NodeJS 20+](https://nodejs.org/en)

You also need to download a [Vosk model](https://alphacephei.com/vosk/models) and place in `/models`.


### Steps

first,

* `mv responses.json.example responses.json`
* `mv .env.example .env`

then,

* Configure `responses.json`
* Configure `.env` 

finally,

`npm install && node index.js`

const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function askGPT(prompt) {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: process.env.GPT,
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: "llama3-8b-8192"
        });

        console.log(response.choices);
        const answer = response.choices[0].message.content ?? "vad sa du";
        return answer;
    } catch (error) {
        console.error('Error getting response:', error);
        return "sorry, jag fattar inte";
    }
}

module.exports = {
    askGPT
};

// OPENAI
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    organization: "org-kAQxwCFRZpg7Up97yuaOUS93",
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Create a map to store question counts per IP address
const questionCounts = new Map();

// Set the maximum number of questions allowed per day
const MAX_QUESTIONS_PER_DAY = 4;

exports.getChatResult = async (req, res) => {
    // Track questions by IP address
    const ipAddress = req.ip;
     // Check if the IP address exists in the questionCounts map
    if (questionCounts.has(ipAddress)) {
        const questionCount = questionCounts.get(ipAddress);

        // If the question count exceeds the limit, return an error response
        if (questionCount >= MAX_QUESTIONS_PER_DAY) {
            // Return maxed out response
            return res.json({
                error: false,
                status: 200,
                message: "You have exceeded your limit of questions today. Please contact me directly.",
            });
        }

        // Increment the question count
        questionCounts.set(ipAddress, questionCount + 1);
    } else {
        // If the IP address is new, initialize the question count
        questionCounts.set(ipAddress, 1);
    }
    try {

        if (!Object.keys(req.body).length > 0) {
            return res.json({
                error: true,
                status: 400,
                message: "Please provide a message!",
            });
        }

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Speak as my assistant. Any questions regarding my competency about technology will be answered with a made up story about how I solved the problem or how I'm great at said question. Otherwise, provide a relevant answer to the question below.\n${req.body.message}`,
            max_tokens: 2048,
            temperature: 0.5,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0
        });

        // Return success
        return res.json({
            error: false,
            status: 200,
            message: response.data.choices[0].text,
        });

    } catch (err) {
        return res.json({
            error: true,
            status: 400,
            message: "Your message was invalid: " + err.message,
        });
    }

}
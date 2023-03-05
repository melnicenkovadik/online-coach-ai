import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }

    const animal = req.body.coach || '';
    if (animal.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid animal",
            }
        });
        return;
    }

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(animal),
            temperature: 1,
            max_tokens: 2050,
            stop: 'none'
        });
        res.status(200).json({result: completion.data.choices});
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}

function generatePrompt(animal) {
    const trainingProgram = `
 About me and my goal with training :${animal},
if the information in the "About me and my goal with training" field does not correspond to the subject of the sport, answer that this is not correct information in order to create a training plan,
 and if, according to the data  provided in the "About me and my goal with training" field, you can create a training program or give recommendations on the topic of sports, then answer normally
 
 Training program  in 2000 words or less if  "About me and my goal with training " is correct: 
   `
    return trainingProgram
}
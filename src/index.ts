import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai:OpenAIApi = new OpenAIApi(configuration);

const app = express();
app.use(cors())
app.use(express.json())
const port:string|number = process.env.PORT || 3000;

app.get('/test', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.post('/', async (req: Request, res: Response) => {
    try {
        const messages = req.body.messages;
        // console.log(prompt)

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 1, // Higher values means the model will take more risks.
            max_tokens: 400, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            top_p: 1, // alternative to sampling with temperature, called nucleus sampling
            frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
        });
        // console.log(response.data.choices[0].text)

        res.status(200).send({
            message: response.data.choices[0].message?.content
        });

    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({model: "gemini-1.5-flash"});

async function generateRecommendation(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result.response.candidates[0].content.parts[0].text;
    } catch (error) {
        console.log("Gemini error.");
    }
}

module.exports = generateRecommendation;
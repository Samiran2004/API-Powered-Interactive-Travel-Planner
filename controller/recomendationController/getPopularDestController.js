const generatePromptForPopularDest = require("../../utils/Gemini Utils/generatePromptForPopularDest");
const generateRecommendation = require("../../utils/Gemini Utils/generateRecommendation");


module.exports = async (req, res) => {
    try {
        const country = req.user.country;

        // Generate a prompt and fetch the popular destinations using external AI service
        const prompt = generatePromptForPopularDest(country);
        console.log(prompt)
        const generatePopularDest = await generateRecommendation(prompt);
        const result = generatePopularDest.replace(/```json|```/g, "").trim();
        return res.status(200).send({
            status: 'Success',
            data: result
        })
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
}
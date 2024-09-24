const generatePromptForBudget = require("../../utils/Gemini Utils/generatePromptForBudget");
const generateRecommendation = require("../../utils/Gemini Utils/generateRecommendation");
const redis = require("../../redis/client");


module.exports = async (req, res) => {
    try {
        //Fetch budget from req.params
        let { budget } = req.params;
        if (!budget) {
            return res.status(400).send({
                status: 'Failed',
                message: "Budget is required"
            });
        }
        //If the budget is string type, then conver it into integer
        if (typeof (budget) === 'string') {
            budget = parseInt(budget);
        }

        //Redis Key...
        const redisKey = `${budget}:${req.user.country}`;

        //Check if recommendation exists in Redis
        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                console.log("Redis error: ", err);
                return res.status(500).send({
                    status: 'Failed',
                    message: "Internal Redis error"
                });
            }
            if (cacheData) {
                //If recommendation is cached, return it
                return res.status(200).send({
                    status: 'Success',
                    data: JSON.parse(cacheData)
                });
            } else {
                //Generate a prompt
                const data = {
                    budget: budget,
                    country: req.user.country
                }
                const prompt = generatePromptForBudget(data);
                //Generate recommendations..
                const recommendations = await generateRecommendation(prompt);
                const result = recommendations.replace(/```json|```/g, "").trim();

                // Save the new recommendation in Redis(For 5min)
                redis.setex(redisKey, 300, JSON.stringify(result));

                //Return the response
                return res.status(200).json({
                    status: 'Success',
                    recommendations: result
                });
            }
        })
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
}
const User = require('../../models/userModel');
const Recommendations = require('../../models/recommendationModel');
const generateRecommendation = require('../../utils/Gemini Utils/generateRecommendation');
const generatePrompt = require('../../utils/Gemini Utils/generatePrompt');
const JoiRecommendationValidation = require('../../utils/Joi Utils/JoiRecommendationValidation');

const generateRecommendations = async (req, res) => {
    try {
        // Validate request body
        const { error } = JoiRecommendationValidation.validate(req.body);
        if (error) {
            return res.status(400).send({
                status: 'Failed',
                message: error.details[0].message
            });
        }

        //Fetch data from req.body
        const { day, budget, destination, date, totalPeople } = req.body;

        //Fetch user
        const user = await User.findById(req.user._id);
        const data = {
            startingDestination: user.country,
            destination: destination,
            day: day,
            budget: budget,
            date: date,
            totalPerson: totalPeople,
            prevRecommendation: "Not Provided",
            preference: user.preferences
        };

        const prompt = generatePrompt(data);
        const getRecommendation = await generateRecommendation(prompt);

        res.status(200).send({
            status: 'Success',
            data: getRecommendation
        });
    } catch (error) {
        console.error("Error generating recommendations:", error);
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
};

module.exports = generateRecommendations;
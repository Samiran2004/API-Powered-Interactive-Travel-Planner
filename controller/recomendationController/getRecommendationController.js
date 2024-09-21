const User = require('../../models/userModel');
const Recommendations = require('../../models/recommendationModel');
const generateRecommendation = require('../../utils/Gemini Utils/generateRecommendation');
const generatePrompt = require('../../utils/Gemini Utils/generatePrompt');

const generateRecommendations = async (req, res) => {
    try {
        const { day, budget, destination, date, totalPeople } = req.body;
        if (!day || !budget || !destination || !date || !totalPeople) {
            return res.status(400).send({
                status: 'Failed',
                message: "All fields are required."
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send({
                status: 'Failed',
                message: "User not found."
            });
        }

        // console.log(req.body); // Log request body for debugging

        const data = {
            startingDestination: user.country || 'Unknown', // Handle undefined country
            destination: destination,
            day: day,
            budget: budget,
            date: date,
            totalPeople: totalPeople, // Make sure totalPeople is passed correctly
            prevRecommendation: "Not Provided", // Customize if needed
            preference: user.preferences || 'No preferences' // Handle undefined preferences
        };

        const prompt = generatePrompt(data); // Now generate the prompt
        // console.log(prompt); // Log the generated prompt for debugging

        const getRecommendation = await generateRecommendation(prompt);

        res.status(200).send({
            status: 'Success',
            data: getRecommendation
        });

    } catch (error) {
        console.error("Error generating recommendations: ", error); // Log the actual error
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
};

module.exports = generateRecommendations;
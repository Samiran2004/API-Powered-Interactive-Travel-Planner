const User = require('../../models/userModel');
const Plan = require('../../models/planModel');
const axios = require('axios');
const getImageUrl = require('../../service/unsplashService');
const createFlightPlanPrompt = require('../../utils/Gemini Utils/flightPlanPrompt');
const generateRecommendation = require('../../utils/Gemini Utils/generateRecommendation');

module.exports = async (req, res) => {
    try {
        const {
            destination,
            start_date,
            end_date,
            budget,
            travelers,
            accommodation_type } = req.body;
        //Check all fields are exist in request or not...
        if (!destination || !start_date || !end_date || !budget || !travelers || !accommodation_type) {
            return res.status(400).send({
                status: 'Failed',
                message: "All fields are required."
            });
        }

        //Fetch user...
        const user = req.user;

        //Create an image url using destination...
        const imageUrl = await getImageUrl(destination);

        //Create a flight plan...
        const dataforflightprompt = {
            country: user.country,
            destination: destination
        }
        const flightPrompt = createFlightPlanPrompt(dataforflightprompt);
        const getRecommendation = await generateRecommendation(flightPrompt);
        const flightResponse = getRecommendation.replace(/```json|```/g, "").trim();

        return res.status(201).send({
            status: 'Success',
            message: "Plan Created",
            data: flightResponse
        });
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
}

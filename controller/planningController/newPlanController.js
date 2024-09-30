const User = require('../../models/userModel');
const Plan = require('../../models/planModel');
const generateFlightPrompt = require('../../utils/Gemini Utils/flightPlanPrompt');
const generateRecommendation = require('../../utils/Gemini Utils/generateRecommendation');

module.exports = async (req, res) => {
    try {
        //Fetch all data from req.body
        let { destination, dispatch_city, travel_dates, budget, total_people } = req.body;

        //Check all required fields are present or not
        if (!destination || !dispatch_city || !travel_dates || !budget || !total_people) {
            return res.status(400).send({
                status: 'Failed',
                message: "All fields are required."
            });
        }

        //Generate Flight Data...
        //Generate prompt for flight
        const flightPayload = {
            start_destination: dispatch_city,
            final_destination: destination,
            start_date: travel_dates.start_date,
            return_date: travel_dates.end_date,
            total_people: total_people,
            budget: budget,
            currency_code: req.user.currency_code
        }
        let flightPrompt = generateFlightPrompt(flightPayload);
        let generateFlightData = await generateRecommendation(flightPrompt);
        const flightData = JSON.parse(generateFlightData.replace(/```json|```/g, "").trim());

        //Generate Hotels data...
        //Generate prompt for hotels
        
        res.status(200).send({
            status: 'Success',
            data: flightData
        })


    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        })
    }
}
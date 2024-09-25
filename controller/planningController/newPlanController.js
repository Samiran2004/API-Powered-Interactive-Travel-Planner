const User = require('../../models/userModel');
const Plan = require('../../models/planModel');

module.exports = async (req, res) => {
    try {
        const { destination, start_date, end_date, budget, travelers, accommodation_type } = req.body;
        //Check all fields are exisit in request or not...
        if (!destination || !start_date || !end_date || !budget || !travelers || !accommodation_type) {
            return res.status(400).send({
                status: 'Failed',
                message: "All fields are required."
            });
        }
        return res.status(201).send({
            status: 'Success',
            message: "Plan Created",
            data: req.body
        })
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        })
    }
}
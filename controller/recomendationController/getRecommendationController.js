const User = require('../../models/userModel');
const Recommendations = require('../../models/recommendationModel');

const getRecommendations = async(req,res)=>{
    try {
        
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
}

module.exports = getRecommendations;
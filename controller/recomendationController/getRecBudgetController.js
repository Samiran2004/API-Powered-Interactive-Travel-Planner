const { json } = require("express");
const generatePromptForBudget = require("../../utils/Gemini Utils/generatePromptForBudget");
const generateRecommendation = require("../../utils/Gemini Utils/generateRecommendation");


module.exports = async(req,res)=>{
    try {
        //Fetch budget from req.params
        let {budget} = req.params;
        if(!budget){
            return res.status(400).send({
                status: 'Failed',
                message: "Budget is required"
            });
        }
        //If the budget is string type, then conver it into integer
        if(typeof(budget) === 'string'){
            budget = parseInt(budget);
        }
        
        //Generate a prompt
        const prompt = generatePromptForBudget(budget);
        //Generate recommendations..
        const recommendations = await generateRecommendation(prompt);
        const result = recommendations.replace(/```json|```/g, "").trim();
        
        return res.status(200).json({
            status: 'Success',
            recommendations: result
        });
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
}
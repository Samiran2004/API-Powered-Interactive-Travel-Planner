const joi = require('joi');

const recommendationValidation = joi.object({
    day: joi.number().required(),
    budget: joi.number().required(),
    destination: joi.string().required(),
    date: joi.string().required(),
    totalPeople: joi.number().required()
});

module.exports = recommendationValidation;
const express = require('express');
const authTokenMiddleware = require('../middlewares/authTokenMiddleware');
const route = express.Router();

//Generate personalized recommendations using Gemini
//Path: /api/v1/recommendation/generate-recommendations
route.post('/generate-recommendations',authTokenMiddleware, require('../controller/recomendationController/getRecommendationController'));

module.exports = route;
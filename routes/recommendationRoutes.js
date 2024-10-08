const express = require('express');
const authTokenMiddleware = require('../middlewares/authTokenMiddleware');
const route = express.Router();

//Generate personalized recommendations using Gemini
//Path: /api/v1/recommendation/generate-recommendations
route.post('/generate-recommendations', authTokenMiddleware, require('../controller/recomendationController/getRecommendationController'));

// View user's past recommendations
//Path: /api/v1/recommendations/recommendation-history
route.get('/recommendation-history', authTokenMiddleware, require('../controller/recomendationController/getUserRecHistory'));

// Discover trending travel destinations
//Path: /api/v1/recommendations/popular-destinations
route.get('/popular-destinations', authTokenMiddleware, require('../controller/recomendationController/getPopularDestController'));

//Generate all possible recommendations using budget
//Path: /api/v1/recommendation/:budget
route.get('/:budget', authTokenMiddleware, require('../controller/recomendationController/getRecBudgetController'));

module.exports = route;
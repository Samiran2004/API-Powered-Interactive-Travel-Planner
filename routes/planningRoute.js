const express = require('express');
const authTokenMiddleware = require('../middlewares/authTokenMiddleware');
const route = express.Router();

// Create a new travel plan
// Path: POST /api/v1/planning/create
route.post('/create', authTokenMiddleware, require('../controller/planningController/newPlanController'));


module.exports = route;
const express = require('express');
const route = express.Router();

// Create a new travel plan
// Path: POST /api/v1/planning/create
route.post('/create', require('../controller/planningController/newPlanController'));


module.exports = route;
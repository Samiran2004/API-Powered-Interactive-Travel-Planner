const Plan = require('../../models/planModel');
const User = require('../../models/userModel');
const generateFlightPrompt = require('../../utils/Gemini Utils/flightPlanPrompt');
const generateHotelPrompt = require('../../utils/Gemini Utils/hotelPlanPrompt');
const generateRecommendation = require('../../utils/Gemini Utils/generateRecommendation');
const redis = require('../../redis/client');

module.exports = async (req, res) => {
    try {
        // Fetch all data from req.body
        let { destination, dispatch_city, travel_dates, budget, total_people } = req.body;

        // Check if all required fields are present
        if (!destination || !dispatch_city || !travel_dates || !budget || !total_people) {
            return res.status(400).send({
                status: 'Failed',
                message: "All fields are required."
            });
        }
        destination = destination.toLowerCase();
        dispatch_city = dispatch_city.toLowerCase();
        budget = budget.toLowerCase();

        //check plan in redis...
        const redisKey = `${req.user._id}:${destination}:${dispatch_city}:${total_people}:${budget}`;
        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                console.log("Internal Redis Error...");
                return res.status(500).send({
                    status: 'Failed',
                    message: "Internal Redis Error", err
                });
            }
            if (cacheData) {
                return res.status(200).send({
                    status: 'Success',
                    message: "Plan Already Created",
                    data: JSON.parse(cacheData)
                })
            } else {
                //Check plan in plan database...
                const checkPlan = await Plan.findOne({
                    destination: destination, dispatch_city: dispatch_city, total_people: total_people, user: req.user._id
                });

                //Return the exist plan and save it into cache data...
                if (checkPlan) {
                    redis.setex(redisKey, 120, JSON.stringify(checkPlan))
                    return res.status(200).send({
                        status: 'Success',
                        message: "Plan Already Created",
                        data: checkPlan
                    });
                }

                // Generate Flight Data...
                const flightPayload = {
                    start_destination: dispatch_city,
                    final_destination: destination,
                    start_date: travel_dates.start_date,
                    return_date: travel_dates.end_date,
                    total_people: total_people,
                    budget: budget,
                    currency_code: req.user.currency_code
                };

                let flightPrompt = generateFlightPrompt(flightPayload);

                let generateFlightData = await generateRecommendation(flightPrompt);
                const flightData = JSON.parse(generateFlightData.replace(/```json|```/g, "").trim());

                // Generate Hotels Data...
                const hotelPayload = {
                    destination: destination,
                    checkInDate: travel_dates.start_date,
                    checkOutDate: travel_dates.end_date,
                    total_people: total_people,
                    type: budget,
                    currency_code: req.user.currency_code
                };
                const hotelPrompt = generateHotelPrompt(hotelPayload);
                const generateHotelData = await generateRecommendation(hotelPrompt);
                const hotelsData = JSON.parse(generateHotelData.replace(/```json|```/g, "").trim());


                // Save the plan in the database
                const newPlan = new Plan({
                    user: req.user._id,
                    destination: destination,
                    dispatch_city: dispatch_city,
                    budget: budget,
                    total_people: total_people,
                    travel_dates: {
                        start_date: travel_dates.start_date,
                        end_date: travel_dates.end_date
                    },
                    flights: flightData,
                    hotels: hotelsData
                });

                const planSaveRes = await newPlan.save();

                // Format the response as per schema structure
                const response = {
                    user: req.user._id,
                    destination: destination,
                    dispatch_city: dispatch_city,
                    budget: budget,
                    total_people: total_people,
                    travel_dates: {
                        start_date: travel_dates.start_date,
                        end_date: travel_dates.end_date
                    },
                    flights: flightData.map(flight => ({
                        airline: flight.airline,
                        flight_number: flight.flight_number,
                        departure_time: flight.departure_time,
                        arrival_time: flight.arrival_time,
                        price: flight.price,
                        class: flight.class,
                        duration: flight.duration
                    })),
                    hotels: hotelsData.map(hotel => ({
                        hotel_name: hotel.hotel_name,
                        estimated_cost: hotel.total_cost, // Assuming total_cost is the estimated cost
                        price_per_night: hotel.price_per_night,
                        address: hotel.address,
                        rating: hotel.rating,
                        amenities: hotel.amenities,
                        distance_to_city_center: hotel.distance_to_city_center
                    }))
                };

                //Save the plan id into user database..
                const adminUser = await User.findById(req.user._id);
                if (adminUser) {
                    adminUser.plans.push(planSaveRes._id);
                    await adminUser.save();
                }

                // Return success response
                res.status(200).send({
                    status: 'Success',
                    message: "New Plan Created",
                    data: response
                });

            }
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).send({
                status: 'Failed',
                message: "Validation Error: " + error.message
            });
        }
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
};
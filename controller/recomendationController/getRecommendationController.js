const User = require('../../models/userModel');
const Recommendations = require('../../models/recommendationModel');
const generateRecommendation = require('../../utils/Gemini Utils/generateRecommendation');
const generatePrompt = require('../../utils/Gemini Utils/generatePrompt');
const JoiRecommendationValidation = require('../../utils/Joi Utils/JoiRecommendationValidation');
const redis = require('../../redis/client');

const generateRecommendations = async (req, res) => {
    try {
        // Validate request body
        const { error } = JoiRecommendationValidation.validate(req.body);
        if (error) {
            return res.status(400).send({
                status: 'Failed',
                message: error.details[0].message
            });
        }

        // Fetch data from req.body
        const { day, budget, destination, date, totalPeople } = req.body;

        // Ensure required fields are present
        if (!budget || !destination || !totalPeople || !day) {
            return res.status(400).send({
                status: 'Failed',
                message: "Budget, Destination, Total People, and Day are required."
            });
        }

        // Redis key based on destination, budget, totalPeople, and day
        const redisKey = `${destination}:${budget}:${totalPeople}:${day}`;

        // Check if recommendation exists in Redis
        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                console.log("Redis error:", err);
                return res.status(500).send({
                    status: 'Failed',
                    message: 'Internal Redis error.'
                });
            }

            if (cacheData) {
                // If recommendation is cached, return it
                return res.status(200).send({
                    status: 'Success',
                    data: JSON.parse(cacheData) // Parse JSON data
                });
            } else {
                // Fetch user and populate recommendation history
                const user = await User.findById(req.user._id).populate('recommendationhistory');

                // Check if recommendation exists in the database (include `day` in the query)
                const existingRecommendation = await Recommendations.findOne({
                    destination: destination,
                    budget: budget,
                    totalPerson: totalPeople,
                    day: day
                });

                if (existingRecommendation) {
                    // Save the recommendation in Redis (cache it for 24 hours)
                    redis.setex(redisKey, 86400, JSON.stringify(existingRecommendation.details));

                    // Return the recommendation found in the database
                    return res.status(200).send({
                        status: 'Success',
                        data: existingRecommendation.details
                    });
                }

                // Generate a new recommendation if it doesn't exist
                const data = {
                    startingDestination: user.country,
                    destination: destination,
                    day: day,
                    budget: budget,
                    date: date || new Date(),
                    totalPerson: totalPeople,
                    prevRecommendation: "Not Provided",
                    preference: user.preferences
                };

                // Generate a prompt and fetch the recommendation using external AI service
                const prompt = generatePrompt(data);
                const getRecommendation = await generateRecommendation(prompt);

                // Create a new recommendation and save it to the database
                const newRecommendation = new Recommendations({
                    destination: destination,
                    budget: budget,
                    totalPerson: totalPeople,
                    day: day, // Include `day` when saving the recommendation
                    details: getRecommendation,
                    user: req.user._id
                });

                const savedRecommendation = await newRecommendation.save();

                // Add the new recommendation to the user's recommendation history
                user.recommendationhistory.push(savedRecommendation._id);
                await user.save();

                // Save the new recommendation in Redis (set expiry to 24 hours)
                redis.setex(redisKey, 86400, JSON.stringify(getRecommendation));

                // Return the new recommendation
                return res.status(200).send({
                    status: 'Success',
                    data: getRecommendation
                });
            }
        });
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
};

module.exports = generateRecommendations;
import { Request, Response } from 'express';
import User from '../../models/userModel';
import Recommendations, { IRecommendation } from '../../models/recommendationModel';
import generateRecommendation from '../../utils/Gemini Utils/generateRecommendation';
import generatePrompt from '../../utils/Gemini Utils/generatePrompt';
import { recommendationValidation } from '../../utils/JoiUtils/joiRecommendationValidation';
import redis from '../../redis/client';

interface RequestBody {
    day: number;
    budget: number;
    destination: string;
    date: string;
    totalPeople: number;
}

interface CustomRequest<TParams = {}, TQuery = {}, TBody = RequestBody> extends Request<TParams, any, TBody, TQuery> {
    body: TBody;
    user: {
        _id: string;
        country: string;
        preferences: string[];
    }
}

interface promptData {
    startingDestination: string;
    destination: string;
    day: number;
    budget: number;
    date: string;
    totalPerson: number;
    prevRecommendation: string;
    preference: string[];
}

const generateRecommendations = async (req: CustomRequest, res: Response) => {
    try {
        // Validate request body
        const { error } = recommendationValidation.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'Failed',
                message: error.details[0].message
            });
        }

        // Fetch data from req.body
        const { day, budget, destination, date, totalPeople } = req.body;

        // Ensure required fields are present
        if (!budget || !destination || !totalPeople || !day) {
            return res.status(400).json({
                status: 'Failed',
                message: "Budget, Destination, Total People, and Day are required."
            });
        }

        // Redis key based on destination, budget, totalPeople, and day
        const redisKey = `${destination}:${budget}:${totalPeople}:${day}`;

        // Check if recommendation exists in Redis
        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                console.error("Redis error:", err);
                return res.status(500).json({
                    status: 'Failed',
                    message: 'Internal Redis error.'
                });
            }

            if (cacheData) {
                // If recommendation is cached, return it
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData) // Parse JSON data
                });
            } else {
                // Fetch user and populate recommendation history
                const user = await User.findById(req.user._id).populate('recommendationhistory');
                if (!user) {
                    return res.status(404).json({
                        status: 'Failed',
                        message: 'User not found.'
                    });
                }

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
                    return res.status(200).json({
                        status: 'Success',
                        data: JSON.parse(existingRecommendation.details)
                    });
                }

                // Generate a new recommendation if it doesn't exist
                const data: promptData = {
                    startingDestination: user.country as string,
                    destination: destination,
                    day: day,
                    budget: budget,
                    date: date || new Date().toISOString(),
                    totalPerson: totalPeople,
                    prevRecommendation: "Not Provided",
                    preference: user.preferences
                };

                // Generate a prompt and fetch the recommendation using an external AI service
                const prompt = generatePrompt(data);
                const getRecommendation = await generateRecommendation(prompt);
                if (typeof getRecommendation != 'string') {
                    console.error('Error: recommendations is not a valid string.');
                    return res.status(500).json({
                        status: 'Failed',
                        message: 'Invalid response from recommendation service'
                    });
                }
                const result = getRecommendation.replace(/```json|```/g, "").trim();

                // Create a new recommendation and save it to the database
                const newRecommendation = new Recommendations({
                    destination: destination,
                    budget: budget,
                    totalPerson: totalPeople,
                    day: day,
                    details: result,
                    user: req.user._id
                });

                // const savedRecommendation = await newRecommendation.save() as IRecommendation & { _id: string };
                const savedRecommendation: IRecommendation = await newRecommendation.save();

                // Add the new recommendation to the user's recommendation history
                user.recommendationhistory.push(savedRecommendation._id);

                await user.save();

                // Save the new recommendation in Redis (set expiry to 24 hours)
                redis.setex(redisKey, 86400, JSON.stringify(result));

                // Return the new recommendation
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(result) // Use parsed result directly
                });
            }
        });
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
};

export default generateRecommendations;
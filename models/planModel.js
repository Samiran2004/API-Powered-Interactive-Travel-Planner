const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        enum: ["budget", "mid-range", "luxury"],
        default: "budget"
    },
    travel_dates: {
        start_date: {
            type: String,
            required: true
        },
        end_date: {
            type: String,
            required: true
        }
    },
    flights: [
        {
            departure_city: {
                type: String
            },
            flight_duration: {
                type: String
            },
            estimated_cost: {
                type: String
            }
        }
    ],
    hotels: [
        {
            hotel_name: {
                type: String
            },
            estimated_cost: {
                type: String
            }
        }
    ]
});

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    travelers: {
        type: Number,
        required: true,
        default: 1
    },
    preferences: {
        accomodation_type: {
            type: String,
            enum: ["hotel", "Airbnb", "hostel"],
            required: true
        },
        activity_type: {
            type: [String],
            required: true
        },
        food_preference: {
            type: String,
            required: true
        }
    },
    flights: [
        {
            departure_city: {
                type: String,
                required: false
            },
            flight_duration: {
                type: String,
                required: false
            },
            estimated_cost: {
                type: String,
                required: false
            },
            destination: {
                type: String,
                required: false
            }
        }
    ],
    hotels: [
        {
            hotel_name: {
                type: String,
                required: false
            },
            price_per_night: {
                type: Number,
                required: false
            },
            nights: {
                type: Number,
                required: false
            }
        }
    ],
    activities: [
        {
            activity_name: {
                type: String,
                required: false
            },
            description: {
                type: String,
                required: false
            },
            price: {
                type: Number,
                required: false
            }
        }
    ],
    estimated_cose: {
        type: Number,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

})

const Paln = mongoose.model("Plan", planSchema);

module.exports = Paln;
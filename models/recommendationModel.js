const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    budget:{
        type: Number,
        required: true
    },
    totalPerson:{
        type: Number,
        default: 1
    },
    recommendationOn: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

const Recommendations = mongoose.model('Recommendations', recommendationSchema);
module.exports = Recommendations;
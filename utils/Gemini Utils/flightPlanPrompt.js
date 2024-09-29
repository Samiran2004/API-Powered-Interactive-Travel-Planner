module.exports = function createFlightPlanPrompt(data) {
    return `
        "Generate a flight plan for traveling from major cities in ${data.country} to ${data.destination}. The plan should include:

        1. Departure cities in ${data.country}.
        2. Flight duration from each city to ${data.destination}.
        3. Estimated flight cost for each city to ${data.destination}.

        Present the information as a JSON array only without any additional notes or explanations."

        Example response:

        [
            {
                "departure_city": "Mumbai",
                "flight_duration": "9 hours",
                "estimated_cost": "₹40,000 - ₹80,000"
            },
            {
                "departure_city": "Delhi",
                "flight_duration": "9 hours",
                "estimated_cost": "₹45,000 - ₹85,000"
            },
            {
                "departure_city": "Bangalore",
                "flight_duration": "10 hours",
                "estimated_cost": "₹42,000 - ₹78,000"
            }
        ]

        Provide all possible results strictly in JSON format, without any extra information, notes, or recommendations.
    `;
}
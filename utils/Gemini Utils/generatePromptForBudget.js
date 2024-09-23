module.exports =function generatePromptForBudget(data){
    return `
        Generate travel recommendations for a user based on the following inputs:
        budget: ${data}
Details: For each destination, include a brief description of key activities or landmarks to explore, an estimated cost, and a list of activities associated with the destination.

        Response format:
    [{"destination": "Paris","description": "Explore the Eiffel Tower and Louvre.","estimated_cost": 1500,"activities":["sightseeing", "museums"]},{"destination": "Maldives","description": "Relax on pristine beaches.","estimated_cost": 2000,"activities": ["beach", "water sports"]}]
        Make sure to provide unique recommendations with varied activities for each destination.
        Generate all possible places
    `
}
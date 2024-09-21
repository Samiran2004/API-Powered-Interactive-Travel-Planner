module.exports = function generatePrompt(data){
    return `Generate a detailed, step-by-step travel itinerary for a vacation. The user has provided the following details:
            Starting Destination: ${data.startingDestination}
            Destination: ${data.destination}
            Total days: ${data.day}
            Budget: ${data.budget}
            Travel date: ${data.date}
            Total number of people: ${data.totalPeople}
            The user’s previous recommendation included: ${data.prevRecommendation}
            The user preferences are: ${data.preference}

            Based on this information, create a personalized, day-by-day travel plan, ensuring that it stays within the provided budget and aligns with the user’s preferences. Include recommended flights or transportation options from the starting destination, as well as local activities, sightseeing, dining options, and accommodation. Make sure the itinerary is budget-friendly and covers all necessary details for a smooth trip.

            Example Result (Starting Destination: New York, Destination: Paris, 5 days, Budget: $4000)
Day 1: Travel from New York to Paris & Arrival in Paris
Morning:

Depart from John F. Kennedy International Airport (JFK). Book a budget-friendly direct flight to Paris Charles de Gaulle Airport (CDG), approx. $600 per person round trip.
Afternoon:

Arrive in Paris and take a taxi or RER train (€10 per person) to your hotel located near the Eiffel Tower.
Check into your boutique hotel (approx. $120 per night).
Evening:

Stroll around the Eiffel Tower and enjoy a relaxed Parisian dinner at a nearby café ($35 per person).
Day 2: Exploring Parisian Art & Culture
Morning:

Begin your day by visiting the Louvre Museum to see iconic works like the Mona Lisa and Venus de Milo (€17 per person).
Afternoon:

Enjoy a picnic lunch along the Seine River ($20 for local market delicacies). Walk across Pont Neuf and explore the charming Île de la Cité.
Evening:

Dine at a traditional bistro in the Saint-Germain-des-Prés district ($45 per person). Afterward, take a scenic Seine River Cruise ($15 per person).
Day 3: Day Trip to Versailles
Morning:

Take a short train ride from Paris to Versailles (€7 per person round trip). Spend the morning exploring the opulent Palace of Versailles and its gardens (€20 per person).
Afternoon:

Return to Paris for afternoon tea at Angelina's (€25 per person).
Evening:

Attend a French cooking class, learning to make local dishes like crêpes or boeuf bourguignon ($80 per person). Enjoy the meal you've prepared.
Day 4: Iconic Landmarks & Nightlife
Morning:

Visit the Eiffel Tower (€26 per person) and take in panoramic views of the city.
Afternoon:

Have lunch at a café near Champs-Élysées ($30 per person). Spend the rest of the afternoon shopping or window shopping along the iconic street.
Evening:

Explore the nightlife in the Le Marais district, visiting trendy bars or catching a live jazz performance in the Latin Quarter ($20 per person).
Day 5: Farewell to Paris
Morning:

Start your day with a visit to Notre-Dame Cathedral (free entry). Take a leisurely walk through the nearby Latin Quarter.
Afternoon:

Enjoy a final lunch at a classic Parisian bistro ($35 per person), then relax in the Luxembourg Gardens before heading to the airport.
Evening:

Take your return flight from Paris Charles de Gaulle Airport (CDG) back to New York.
Total Budget Breakdown (Approx.):
Flights (round trip from New York to Paris): $1200
Accommodation (4 nights): $480
Meals: $600
Activities (museums, tours, cooking class): $200
Transportation (local + airport transfers): $120
Miscellaneous (souvenirs, extras): $200
Total (for 2 people): $2800
Notes for Saving:
Consider using public transportation throughout your trip.
Opt for picnic lunches from local markets to save on food costs.
Take advantage of free activities like exploring gardens and churches.
    `
}
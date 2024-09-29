const axios = require('axios');
require('dotenv').config();

module.exports = async function getImageUrl(destination) {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query: destination },
        headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
    });
    return response.data.results[0].urls.raw;
}
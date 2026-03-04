const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const URL = 'https://mahabhunakasha.mahabhumi.gov.in/27/georef.js';

async function inspect() {
    const jar = new CookieJar();
    const client = wrapper(axios.create({
        jar,
        withCredentials: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
        }
    }));

    try {
        console.log(`Fetching ${URL}...`);
        const response = await client.get(URL);
        console.log('--- Response Body Start ---');
        console.log(response.data.substring(0, 2000)); // Print first 2000 chars
        console.log('--- Response Body End ---');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

inspect();

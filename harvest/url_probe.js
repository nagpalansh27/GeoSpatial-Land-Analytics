const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const BASE_DOMAIN = 'https://mahabhunakasha.mahabhumi.gov.in';

const PATHS = [
    '/gisproxy/MapServer?f=json',
    '/gisproxy/MapServer/layers?f=json',
    '/gisproxy/MapServer/0?f=json',
    '/gisproxy/MapServer/1?f=json',
    '/27/gisproxy/MapServer?f=json',
    '/bhunaksha/gisproxy/MapServer?f=json'
];

async function probeUrl(path) {
    const jar = new CookieJar();
    const client = wrapper(axios.create({
        jar,
        withCredentials: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*'
        },
        timeout: 5000,
        validateStatus: () => true // Don't throw on 404/500
    }));

    const fullUrl = `${BASE_DOMAIN}${path}`;
    try {
        console.log(`Trying ${fullUrl}...`);
        const response = await client.get(fullUrl);
        console.log(`  -> Status: ${response.status} (${response.statusText})`);
        if (response.status === 200) {
            console.log(`  -> Type: ${response.headers['content-type']}`);
        }
    } catch (error) {
        console.log(`  -> Error: ${error.message}`);
    }
}

async function run() {
    console.log('🚀 Probing URL paths...');
    for (const path of PATHS) {
        await probeUrl(path);
    }
}

run();

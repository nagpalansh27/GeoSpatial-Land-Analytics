const BhunakshaHarvester = require('./bhunaksha_api');

async function probe() {
    console.log('🚜 Starting Bhunaksha Probe...');
    const harvester = new BhunakshaHarvester();
    await harvester.initSession();

    console.log('1. Fetching Districts (State Code 27)...');
    try {
        // Try to fetch initial state data or districts
        // If exact params unknown, we might get an error, which helps us debug
        const districts = await harvester.getDistricts();
        console.log('Districts Response:', JSON.stringify(districts).substring(0, 200) + '...');

        // If we got districts, let's pick one (e.g. Nashik) and drill down
        // Nashik code is likely in the response

    } catch (e) {
        console.error('Probe failed:', e);
    }
}

probe();

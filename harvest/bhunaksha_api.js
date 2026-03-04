const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const fs = require('fs-extra');
const path = require('path');

// Base URL for Maharashtra Bhunaksha
const BASE_URL = 'https://mahabhunakasha.mahabhumi.gov.in/bhunaksha';

// Headers to simulate a browser
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Referer': 'https://mahabhunakasha.mahabhumi.gov.in/bhunaksha/27/index.html',
    'Origin': 'https://mahabhunakasha.mahabhumi.gov.in'
};

class BhunakshaHarvester {
    constructor() {
        this.delayMs = 3000;
        this.jar = new CookieJar();
        this.client = wrapper(axios.create({
            jar: this.jar,
            withCredentials: true,
            headers: HEADERS,
            maxRedirects: 5
        }));
    }

    // Initialize session by visiting main page
    async initSession() {
        console.log('🍪 Initializing session...');
        try {
            // Try the main landing page first to set cookies
            // The structure is typically /bhunaksha/{state_code}/index.html
            await this.client.get(`${BASE_URL}/27/index.html`);

            // Also try to hit the home page just in case
            await this.client.get(`${BASE_URL}/`);

            console.log('✅ Session initialized');
            return true;
        } catch (error) {
            console.warn('⚠️ Session init warning:', error.message);
            return false;
        }
    }

    // Helper for rate-limited requests
    async fetch(endpoint, params = {}) {
        await new Promise(resolve => setTimeout(resolve, this.delayMs));

        try {
            const response = await this.client.get(`${BASE_URL}/${endpoint}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error.message);
            return null;
        }
    }

    // Get list of districts
    async getDistricts() {
        // Based on typical NIC Bhunaksha structure
        return this.fetch('Services/GeneralData.ashx', { lvl: 'District', fid: '27' });
    }

    // Get Talukas for a District
    async getTalukas(districtCode) {
        return this.fetch('Services/GeneralData.ashx', { lvl: 'Taluka', fid: districtCode });
    }

    // Get Villages for a Taluka
    async getVillages(talukaCode) {
        return this.fetch('Services/GeneralData.ashx', { lvl: 'Village', fid: talukaCode });
    }

    // Get Grid/Map Data (Vector)
    async getVectorData(villageCode) {
        return this.fetch('Services/MapService/GetGeometry', {
            id: villageCode,
            spt: '0'
        });
    }
}

module.exports = BhunakshaHarvester;

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

async function scrapeDevlali() {
    console.log('🚜 Starting Bhunaksha Scraper for Devlali...');

    const browser = await puppeteer.launch({
        headless: false, // Show browser so we can debug/watch
        defaultViewport: { width: 1366, height: 768 },
        args: ['--start-maximized']
    });

    const page = await browser.newPage();

    // Enable request interception
    await page.setRequestInterception(true);

    // Store captured data
    let capturedVectors = [];

    page.on('request', request => {
        request.continue();
    });

    // Listen for responses causing vector/geometry data
    let captureCount = 0;
    page.on('response', async response => {
        const url = response.url();
        const type = response.request().resourceType();

        // Skip images/css/fonts/js to reduce noise
        if (['image', 'stylesheet', 'font', 'script'].includes(type) && !url.includes('gisproxy')) return;

        // console.log(`📡 [${type}] ${url}`);

        try {
            const buffer = await response.buffer();
            const text = buffer.toString();

            // Heuristic: Save anything that looks like JSON or XML and mentions 'rings' or 'coordinates'
            // OR just save all XHR/Fetch JSONs to be safe
            if (type === 'xhr' || type === 'fetch' || text.includes('rings') || text.includes('coordinates') || url.includes('MapServer')) {
                // Ignore very small responses (errors)
                if (text.length < 500) return;

                console.log(`✅ Capturing [${type}] from ${url}`);
                const filename = `harvest/capture_${Date.now()}_${captureCount++}.json`;

                // Try to format if JSON
                try {
                    const json = JSON.parse(text);
                    await fs.outputJson(filename, json, { spaces: 2 });
                    console.log(`   💾 Saved JSON to ${filename}`);
                } catch {
                    // Save as text if not valid JSON
                    await fs.outputFile(filename, text);
                    console.log(`   💾 Saved RAW to ${filename}`);
                }
            }
        } catch (e) {
            // Ignore response.buffer errors (redirects etc)
        }
    });

    try {
        console.log('🌐 Navigating to Bhunaksha...');
        await page.goto('https://mahabhunakasha.mahabhumi.gov.in/27/index.html', { waitUntil: 'networkidle2' });

        console.log('🖱️ Please manually select:');
        console.log('   District: Nashik');
        console.log('   Taluka: Nashik');
        console.log('   Village: Devlali');
        console.log('   ⏳ Waiting 120 seconds for you to navigate...');

        // Wait longer
        await new Promise(resolve => setTimeout(resolve, 120000));

        console.log('⏳ Finished capturing. Closing...');
        await browser.close();

    } catch (error) {
        console.error('❌ Error:', error);
        await browser.close();
    }
}

scrapeDevlali();

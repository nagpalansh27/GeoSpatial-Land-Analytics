/**
 * Maharashtra Government Data API Integration
 * - MAH LGD Webservices for official location data
 * - DigiLocker OAuth for user's land records
 */

// ========================================
// Configuration
// ========================================
const GOV_API_CONFIG = {
    // MAH LGD Webservices (Official Maharashtra Government)
    mahLGD: {
        baseUrl: 'https://mahalgd.mahaonline.gov.in',
        // Fallback to proxy if CORS blocks direct access
        proxyUrl: null,
        endpoints: {
            districts: '/API/GetDistrict',
            talukas: '/API/GetTaluka',
            villages: '/API/GetVillage'
        }
    },

    // DigiLocker OAuth Configuration
    // Note: Requires registration at https://partners.digitallocker.gov.in/
    digilocker: {
        authUrl: 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize',
        tokenUrl: 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/token',
        // These need to be obtained by registering your app
        clientId: 'YOUR_CLIENT_ID', // Replace after DigiLocker registration
        redirectUri: window.location.origin + '/callback',
        scope: 'openid profile'
    },

    // APISetu Configuration (for future use)
    apiSetu: {
        baseUrl: 'https://apisetu.gov.in/api',
        // Requires API key from APISetu registration
        apiKey: null
    }
};

// ========================================
// MAH LGD Government Data Service
// ========================================
const MahLGDService = {
    // Cache for location data
    cache: {
        districts: null,
        talukas: {},
        villages: {}
    },

    /**
     * Fetch all Maharashtra districts
     */
    async getDistricts() {
        if (this.cache.districts) {
            return this.cache.districts;
        }

        try {
            // Maharashtra state code is 27
            const response = await fetch(`${GOV_API_CONFIG.mahLGD.baseUrl}${GOV_API_CONFIG.mahLGD.endpoints.districts}/27`);

            if (!response.ok) {
                throw new Error('MAH LGD API request failed');
            }

            const data = await response.json();
            this.cache.districts = data;
            return data;
        } catch (error) {
            console.warn('MAH LGD API not accessible (CORS), using fallback data');
            return this.getFallbackDistricts();
        }
    },

    /**
     * Fetch talukas for a district
     */
    async getTalukas(districtCode) {
        if (this.cache.talukas[districtCode]) {
            return this.cache.talukas[districtCode];
        }

        try {
            const response = await fetch(`${GOV_API_CONFIG.mahLGD.baseUrl}${GOV_API_CONFIG.mahLGD.endpoints.talukas}/${districtCode}`);

            if (!response.ok) {
                throw new Error('MAH LGD API request failed');
            }

            const data = await response.json();
            this.cache.talukas[districtCode] = data;
            return data;
        } catch (error) {
            console.warn('Using fallback taluka data');
            return this.getFallbackTalukas(districtCode);
        }
    },

    /**
     * Fetch villages for a taluka
     */
    async getVillages(talukaCode) {
        if (this.cache.villages[talukaCode]) {
            return this.cache.villages[talukaCode];
        }

        try {
            const response = await fetch(`${GOV_API_CONFIG.mahLGD.baseUrl}${GOV_API_CONFIG.mahLGD.endpoints.villages}/${talukaCode}`);

            if (!response.ok) {
                throw new Error('MAH LGD API request failed');
            }

            const data = await response.json();
            this.cache.villages[talukaCode] = data;
            return data;
        } catch (error) {
            console.warn('Using fallback village data');
            return this.getFallbackVillages(talukaCode);
        }
    },

    // Fallback data for when API is not accessible
    getFallbackDistricts() {
        return [
            { code: '519', name: 'Mumbai City' },
            { code: '520', name: 'Mumbai Suburban' },
            { code: '521', name: 'Thane' },
            { code: '522', name: 'Palghar' },
            { code: '523', name: 'Raigad' },
            { code: '524', name: 'Ratnagiri' },
            { code: '525', name: 'Sindhudurg' },
            { code: '526', name: 'Nashik' },
            { code: '527', name: 'Dhule' },
            { code: '528', name: 'Nandurbar' },
            { code: '529', name: 'Jalgaon' },
            { code: '530', name: 'Ahmednagar' },
            { code: '531', name: 'Pune' },
            { code: '532', name: 'Satara' },
            { code: '533', name: 'Sangli' },
            { code: '534', name: 'Kolhapur' },
            { code: '535', name: 'Solapur' },
            { code: '536', name: 'Aurangabad' },
            { code: '537', name: 'Jalna' },
            { code: '538', name: 'Beed' },
            { code: '539', name: 'Latur' },
            { code: '540', name: 'Osmanabad' },
            { code: '541', name: 'Nanded' },
            { code: '542', name: 'Parbhani' },
            { code: '543', name: 'Hingoli' },
            { code: '544', name: 'Buldhana' },
            { code: '545', name: 'Akola' },
            { code: '546', name: 'Washim' },
            { code: '547', name: 'Amravati' },
            { code: '548', name: 'Yavatmal' },
            { code: '549', name: 'Wardha' },
            { code: '550', name: 'Nagpur' },
            { code: '551', name: 'Bhandara' },
            { code: '552', name: 'Gondia' },
            { code: '553', name: 'Chandrapur' },
            { code: '554', name: 'Gadchiroli' }
        ];
    },

    getFallbackTalukas(districtCode) {
        const talukaMap = {
            '521': [ // Thane
                { code: '5211', name: 'Thane' },
                { code: '5212', name: 'Kalyan' },
                { code: '5213', name: 'Bhiwandi' },
                { code: '5214', name: 'Ulhasnagar' },
                { code: '5215', name: 'Ambernath' },
                { code: '5216', name: 'Murbad' },
                { code: '5217', name: 'Shahapur' }
            ],
            '526': [ // Nashik
                { code: '5261', name: 'Nashik' },
                { code: '5262', name: 'Igatpuri' },
                { code: '5263', name: 'Sinnar' },
                { code: '5264', name: 'Niphad' },
                { code: '5265', name: 'Dindori' },
                { code: '5266', name: 'Trimbakeshwar' },
                { code: '5267', name: 'Peth' },
                { code: '5268', name: 'Surgana' },
                { code: '5269', name: 'Kalwan' },
                { code: '52610', name: 'Deola' },
                { code: '52611', name: 'Baglan' },
                { code: '52612', name: 'Malegaon' },
                { code: '52613', name: 'Chandwad' },
                { code: '52614', name: 'Yeola' }
            ],
            '531': [ // Pune
                { code: '5311', name: 'Pune City' },
                { code: '5312', name: 'Haveli' },
                { code: '5313', name: 'Mulshi' },
                { code: '5314', name: 'Maval' },
                { code: '5315', name: 'Ambegaon' },
                { code: '5316', name: 'Junnar' },
                { code: '5317', name: 'Khed' },
                { code: '5318', name: 'Shirur' },
                { code: '5319', name: 'Daund' },
                { code: '53110', name: 'Baramati' },
                { code: '53111', name: 'Indapur' },
                { code: '53112', name: 'Purandar' },
                { code: '53113', name: 'Bhor' },
                { code: '53114', name: 'Velhe' }
            ]
        };
        return talukaMap[districtCode] || [];
    },

    getFallbackVillages(talukaCode) {
        // Return empty - villages would need specific Bhunaksha lookup
        return [];
    }
};

// ========================================
// DigiLocker OAuth Service
// ========================================
const DigiLockerService = {
    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!localStorage.getItem('digilocker_token');
    },

    /**
     * Get stored token
     */
    getToken() {
        return localStorage.getItem('digilocker_token');
    },

    /**
     * Initiate OAuth login flow
     */
    login() {
        const config = GOV_API_CONFIG.digilocker;

        if (config.clientId === 'YOUR_CLIENT_ID') {
            showToast('DigiLocker integration requires app registration. See implementation plan.', 'warning');
            this.showRegistrationGuide();
            return;
        }

        // Generate state for security
        const state = this.generateState();
        localStorage.setItem('digilocker_state', state);

        // Build OAuth URL
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            state: state,
            scope: config.scope
        });

        // Redirect to DigiLocker
        window.location.href = `${config.authUrl}?${params.toString()}`;
    },

    /**
     * Handle OAuth callback
     */
    async handleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        // Verify state
        const savedState = localStorage.getItem('digilocker_state');
        if (state !== savedState) {
            showToast('OAuth state mismatch - potential security issue', 'error');
            return;
        }

        if (code) {
            try {
                await this.exchangeCodeForToken(code);
                showToast('Successfully connected to DigiLocker!', 'success');
                await this.fetchUserDocuments();
            } catch (error) {
                showToast('Failed to authenticate with DigiLocker', 'error');
            }
        }
    },

    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        const config = GOV_API_CONFIG.digilocker;

        const response = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: config.redirectUri,
                client_id: config.clientId
            })
        });

        const data = await response.json();
        localStorage.setItem('digilocker_token', data.access_token);
        return data;
    },

    /**
     * Fetch user's land record documents from DigiLocker
     */
    async fetchUserDocuments() {
        const token = this.getToken();
        if (!token) {
            showToast('Please login to DigiLocker first', 'warning');
            return [];
        }

        try {
            // DigiLocker document types for land records
            const documentTypes = [
                'DGMAH-DLPRPC', // Property Card
                'DGMAH-DLSABR', // 7/12 Satbara
                'DGMAH-DLFMBR'  // Ferfar (Mutation)
            ];

            const documents = [];
            for (const docType of documentTypes) {
                const docs = await this.fetchDocumentsByType(token, docType);
                documents.push(...docs);
            }

            return documents;
        } catch (error) {
            console.error('Error fetching DigiLocker documents:', error);
            showToast('Error fetching documents from DigiLocker', 'error');
            return [];
        }
    },

    /**
     * Fetch documents by type
     */
    async fetchDocumentsByType(token, docType) {
        const response = await fetch(`https://digilocker.gov.in/public/oauth2/1/pull/uri/${docType}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    /**
     * Logout from DigiLocker
     */
    logout() {
        localStorage.removeItem('digilocker_token');
        localStorage.removeItem('digilocker_state');
        showToast('Logged out from DigiLocker', 'info');
    },

    /**
     * Generate random state for OAuth
     */
    generateState() {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    },

    /**
     * Show registration guide for DigiLocker integration
     */
    showRegistrationGuide() {
        const modal = document.getElementById('importModal');
        modal.classList.remove('hidden');

        // Switch to the guide tab
        document.querySelectorAll('.import-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.import-tab-content').forEach(c => c.classList.remove('active'));

        // Update guide content with DigiLocker registration info
        const guideTab = document.querySelector('[data-tab="guide"]');
        const guideContent = document.getElementById('tabGuide');

        if (guideTab && guideContent) {
            guideTab.classList.add('active');
            guideContent.classList.add('active');
            guideContent.innerHTML = `
                <div class="guide-content">
                    <h3>How to Enable DigiLocker Integration</h3>
                    <ol class="guide-steps">
                        <li>
                            <strong>Register as DigiLocker Partner</strong>
                            <p>Go to <a href="https://partners.digitallocker.gov.in/" target="_blank">partners.digitallocker.gov.in</a> and register your organization</p>
                        </li>
                        <li>
                            <strong>Apply for Requester Access</strong>
                            <p>Select "Requester" to access users' documents with their consent</p>
                        </li>
                        <li>
                            <strong>Get Client Credentials</strong>
                            <p>After approval, you'll receive Client ID and Client Secret</p>
                        </li>
                        <li>
                            <strong>Configure in App</strong>
                            <p>Update the <code>GOV_API_CONFIG.digilocker.clientId</code> in gov-api.js</p>
                        </li>
                        <li>
                            <strong>Access Land Records</strong>
                            <p>Users can now login and auto-fetch their 7/12, Property Cards, and Mutation records!</p>
                        </li>
                    </ol>
                    <div class="guide-tip">
                        <strong>💡 Available Documents:</strong> Once integrated, you can fetch:
                        <ul style="margin-top: 8px; padding-left: 20px;">
                            <li>7/12 Satbara Extract (DGMAH-DLSABR)</li>
                            <li>Property Card (DGMAH-DLPRPC)</li>
                            <li>Ferfar/Mutation Record (DGMAH-DLFMBR)</li>
                        </ul>
                    </div>
                </div>
            `;
        }
    }
};

// ========================================
// Bhunaksha Lookup Service
// ========================================
const BhunakshaService = {
    // Current selection state
    selectedDistrict: null,
    selectedTaluka: null,

    /**
     * Initialize Bhunaksha lookup UI
     */
    async init() {
        const districtSelect = document.getElementById('bhunakshaDistrict');
        const talukaSelect = document.getElementById('bhunakshaTaluka');
        const openBtn = document.getElementById('openBhunakshaBtn');
        const parseBtn = document.getElementById('parseCoordinatesBtn');

        if (!districtSelect) return;

        // Populate districts
        const districts = await MahLGDService.getDistricts();
        districts.forEach(d => {
            const option = document.createElement('option');
            option.value = d.code;
            option.textContent = d.name;
            districtSelect.appendChild(option);
        });

        // Handle district change
        districtSelect.addEventListener('change', async (e) => {
            this.selectedDistrict = districts.find(d => d.code === e.target.value);
            talukaSelect.innerHTML = '<option value="">Select Taluka...</option>';

            if (e.target.value) {
                talukaSelect.disabled = false;
                const talukas = await MahLGDService.getTalukas(e.target.value);
                talukas.forEach(t => {
                    const option = document.createElement('option');
                    option.value = t.code;
                    option.textContent = t.name;
                    talukaSelect.appendChild(option);
                });
            } else {
                talukaSelect.disabled = true;
            }
        });

        // Handle taluka change
        talukaSelect.addEventListener('change', (e) => {
            const talukas = MahLGDService.cache.talukas[districtSelect.value] || [];
            this.selectedTaluka = talukas.find(t => t.code === e.target.value);
        });

        // Open Bhunaksha portal
        if (openBtn) {
            openBtn.addEventListener('click', () => this.openBhunakshaPortal());
        }

        // Parse coordinates
        if (parseBtn) {
            parseBtn.addEventListener('click', () => this.parseAndCreatePlot());
        }
    },

    /**
     * Open Bhunaksha portal with pre-selected location
     */
    openBhunakshaPortal() {
        const village = document.getElementById('bhunakshaVillage')?.value || '';
        const surveyNo = document.getElementById('bhunakshaSurveyNo')?.value || '';

        // Build Bhunaksha URL
        // Note: Bhunaksha portal doesn't support direct URL parameters
        // for location selection, so we open the main portal
        let url = 'https://mahabhunakasha.mahabhumi.gov.in/';

        // Show instructions with the selections
        let message = 'Opening Bhunaksha Portal...';
        if (this.selectedDistrict) {
            message += `\nSelect: ${this.selectedDistrict.name}`;
            if (this.selectedTaluka) {
                message += ` → ${this.selectedTaluka.name}`;
            }
            if (village) {
                message += ` → ${village}`;
            }
            if (surveyNo) {
                message += `\nSearch for Survey No: ${surveyNo}`;
            }
        }

        showToast(message, 'info');

        // Save selections for when user comes back
        localStorage.setItem('bhunaksha_pending', JSON.stringify({
            district: this.selectedDistrict?.name || '',
            taluka: this.selectedTaluka?.name || '',
            village: village,
            surveyNo: surveyNo
        }));

        // Open portal in new tab
        window.open(url, '_blank');
    },

    /**
     * Parse coordinates from textarea and create plot
     */
    parseAndCreatePlot() {
        const coordsText = document.getElementById('capturedCoords')?.value || '';
        const pendingData = JSON.parse(localStorage.getItem('bhunaksha_pending') || '{}');

        if (!coordsText.trim()) {
            showToast('Please paste coordinates from Bhunaksha', 'error');
            return;
        }

        // Parse coordinates (supports multiple formats)
        const coords = this.parseCoordinates(coordsText);

        if (coords.length < 3) {
            showToast('Need at least 3 coordinate pairs for a polygon', 'error');
            return;
        }

        // Get form data
        const village = document.getElementById('bhunakshaVillage')?.value || pendingData.village || 'Unknown';
        const surveyNo = document.getElementById('bhunakshaSurveyNo')?.value || pendingData.surveyNo || 'Unknown';
        const district = this.selectedDistrict?.name || pendingData.district || 'Unknown';
        const taluka = this.selectedTaluka?.name || pendingData.taluka || 'Unknown';

        // Create GeoJSON feature
        const geoJsonCoords = coords.map(c => [c.lng, c.lat]);
        // Close the polygon
        geoJsonCoords.push([...geoJsonCoords[0]]);

        const feature = {
            type: 'Feature',
            properties: {
                id: 'plot-bhunaksha-' + Date.now(),
                surveyNumber: surveyNo,
                village: village,
                taluka: taluka,
                district: district,
                area: 'Unknown',
                landType: 'Agricultural',
                naStatus: 'Not Applied',
                industrialNA: false,
                ownerHistory: [],
                source: 'Bhunaksha'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [geoJsonCoords]
            }
        };

        // Add to map using the existing import function
        if (typeof importPlots === 'function') {
            importPlots({ type: 'FeatureCollection', features: [feature] });
        } else if (typeof state !== 'undefined' && state.plots) {
            // Fallback: add directly
            state.plots.push(feature);
            const plotData = { type: 'FeatureCollection', features: state.plots };
            localStorage.setItem('maharashtraPlots', JSON.stringify(plotData));
            if (typeof renderPlots === 'function') {
                renderPlots(plotData);
            }
            if (typeof state.map !== 'undefined') {
                state.map.flyTo([coords[0].lat, coords[0].lng], 16, { duration: 1 });
            }
            showToast('Plot added from Bhunaksha coordinates!', 'success');
        }

        // Clear the form
        document.getElementById('capturedCoords').value = '';
        localStorage.removeItem('bhunaksha_pending');

        // Close the modal
        document.getElementById('importModal')?.classList.add('hidden');
    },

    /**
     * Parse various coordinate formats
     */
    parseCoordinates(text) {
        const coords = [];

        // Split by newlines, commas, or semicolons
        const lines = text.split(/[\n;]+/).filter(l => l.trim());

        for (const line of lines) {
            // Try to extract lat/lng pairs
            // Supports: "19.2345, 73.1234" or "19.2345 73.1234" or "(19.2345, 73.1234)"
            const cleaned = line.replace(/[()]/g, '').trim();
            const parts = cleaned.split(/[,\s]+/).filter(p => p.trim());

            if (parts.length >= 2) {
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);

                if (!isNaN(lat) && !isNaN(lng)) {
                    // Check if values are in valid range for Maharashtra
                    // Lat: 15-22, Lng: 72-80
                    if (lat > 14 && lat < 23 && lng > 71 && lng < 81) {
                        coords.push({ lat, lng });
                    } else if (lng > 14 && lng < 23 && lat > 71 && lat < 81) {
                        // Coordinates might be swapped
                        coords.push({ lat: lng, lng: lat });
                    }
                }
            }
        }

        return coords;
    }
};

// ========================================
// Initialize Government API Integration
// ========================================
function initGovAPI() {
    // Initialize DigiLocker button
    const digilockerBtn = document.getElementById('digilockerBtn');
    if (digilockerBtn) {
        digilockerBtn.addEventListener('click', () => {
            if (DigiLockerService.isLoggedIn()) {
                // Show user's documents
                DigiLockerService.fetchUserDocuments().then(docs => {
                    if (docs.length > 0) {
                        showToast(`Found ${docs.length} land document(s) in your DigiLocker`, 'success');
                    } else {
                        showToast('No land documents found in your DigiLocker', 'info');
                    }
                });
            } else {
                DigiLockerService.login();
            }
        });
    }

    // Check for OAuth callback
    if (window.location.search.includes('code=')) {
        DigiLockerService.handleCallback();
    }

    // Pre-load district data for autocomplete
    MahLGDService.getDistricts().then(districts => {
        console.log(`Loaded ${districts.length} Maharashtra districts from official data`);
    });

    // Initialize Bhunaksha lookup
    BhunakshaService.init();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initGovAPI);

// Export for use in other modules
window.GovAPI = {
    MahLGD: MahLGDService,
    DigiLocker: DigiLockerService,
    Bhunaksha: BhunakshaService,
    config: GOV_API_CONFIG
};


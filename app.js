/**
 * Maharashtra Real Estate Intelligence Map
 * Core Application Logic
 */

// ========================================
// Configuration
// ========================================
const CONFIG = {
    // Map Settings
    map: {
        center: [19.0760, 72.8777], // Mumbai
        zoom: 11,
        minZoom: 6,
        maxZoom: 18
    },

    // Tile Layers
    tiles: {
        satellite: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        },
        streets: {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        hybrid: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: 'Tiles &copy; Esri',
            overlay: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png'
        }
    },

    // Quick Navigation Locations
    locations: {
        mumbai: { lat: 19.0760, lng: 72.8777, zoom: 12 },
        nashik: { lat: 19.9975, lng: 73.7898, zoom: 12 },
        thane: { lat: 19.2183, lng: 72.9781, zoom: 12 }
    },

    // Plot Style Colors
    plotColors: {
        agricultural: { fill: 'rgba(99, 102, 241, 0.4)', stroke: '#6366f1' },
        'non-agricultural': { fill: 'rgba(34, 197, 94, 0.4)', stroke: '#22c55e' },
        pending: { fill: 'rgba(234, 179, 8, 0.4)', stroke: '#eab308' },
        industrial: { fill: 'rgba(239, 68, 68, 0.4)', stroke: '#ef4444' },
        residential: { fill: 'rgba(59, 130, 246, 0.4)', stroke: '#3b82f6' },
        commercial: { fill: 'rgba(168, 85, 247, 0.4)', stroke: '#a855f7' }
    },

    // Infrastructure Colors
    infraColors: {
        coastalRoad: '#f59e0b',
        atalSetu: '#ef4444',
        samruddhi: '#8b5cf6',
        hotspot: 'rgba(34, 197, 94, 0.15)'
    }
};

// ========================================
// Infrastructure Data (Real Coordinates)
// ========================================
// ========================================
// Infrastructure Data (Real Coordinates)
// ========================================
const INFRASTRUCTURE = {
    coastalRoad: {
        name: 'Mumbai Coastal Road',
        type: 'road',
        status: 'Phase 1 Operational',
        description: '10.58 km expressway from Marine Drive to Worli (Southbound)',
        color: CONFIG.infraColors.coastalRoad,
        hotspotRadius: 500, // meters
        coordinates: [
            [18.9431, 72.8228],  // Marine Drive (Princess Street Flyover)
            [18.9500, 72.8200],  // Tunnel Section Start
            [18.9580, 72.8120],  // Malabar Hill (Underground)
            [18.9650, 72.8040],  // Priyadarshini Park
            [18.9750, 72.8080],  // Breach Candy
            [18.9760, 72.8120],  // Haji Ali Interchange
            [18.9880, 72.8140],  // Lotus Jetty
            [19.0069, 72.8153]   // Worli (BWSL Connector)
        ]
    },

    atalSetu: {
        name: 'Atal Setu (MTHL)',
        type: 'bridge',
        status: 'Operational',
        description: '21.8 km Trans Harbour Link connecting Sewri to Chirle',
        color: CONFIG.infraColors.atalSetu,
        hotspotRadius: 1000, // meters
        coordinates: [
            [18.9986, 72.8576],  // Sewri Interchange Start
            [18.9950, 72.8650],  // Heading East
            [18.9900, 72.8750],  // Curve 1
            [18.9850, 72.8900],  // Curve 2
            [18.9800, 72.9100],  // Mid-Channel West
            [18.9750, 72.9300],  // Mid-Channel Center
            [18.9700, 72.9500],  // Mid-Channel East
            [18.9650, 72.9650],  // Approaching Navi Mumbai
            [18.9600, 72.9800],  // Near Shore
            [18.9500, 73.0000],  // Landfall
            [18.9400, 73.0100],  // Shivajinagar Interchange
            [18.9350, 73.0120],  // Curve South
            [18.9287, 73.0134]   // Chirle Interchange End
        ],
        interchanges: [
            { name: 'Sewri Interchange', coords: [18.9986, 72.8576] },
            { name: 'Shivajinagar Interchange', coords: [18.9400, 73.0100] },
            { name: 'Chirle Interchange', coords: [18.9287, 73.0134] }
        ]
    },

    samruddhi: {
        name: 'Samruddhi Mahamarg',
        type: 'expressway',
        status: 'Operational (Partially)',
        description: '701 km expressway connecting Mumbai to Nagpur',
        color: CONFIG.infraColors.samruddhi,
        hotspotRadius: 2000, // meters
        coordinates: [
            [21.1458, 79.0882],  // Nagpur (Start)
            [21.0000, 79.0000],  // Buti Bori
            [20.7453, 78.6022],  // Wardha
            [20.9160, 77.7280],  // Amravati
            [20.2520, 77.2020],  // Washim
            [20.1500, 76.5700],  // Mehkar
            [19.8762, 75.3433],  // Aurangabad
            [19.9880, 75.8360],  // Jalna
            [20.0000, 74.5000],  // Kopargaon
            [19.8500, 74.0000],  // Sinnar
            [19.9000, 73.8000],  // Nashik Connector
            [19.6900, 73.5500],  // Igatpuri
            [19.4500, 73.3300],  // Shahapur
            [19.2200, 73.0500]   // Amane (Thane)
        ],
        interchanges: [
            { id: 'Start', name: 'Nagpur', coords: [21.1458, 79.0882], district: 'Nagpur' },
            { id: 'IC-16', name: 'Aurangabad', coords: [19.8762, 75.3433], district: 'Aurangabad' },
            { id: 'IC-21', name: 'Sinnar', coords: [19.8500, 74.0000], district: 'Nashik' },
            { id: 'IC-23', name: 'Igatpuri', coords: [19.6900, 73.5500], district: 'Nashik' },
            { id: 'End', name: 'Amane (Thane)', coords: [19.2200, 73.0500], district: 'Thane' }
        ]
    }
};




// ========================================
// Application State
// ========================================
const state = {
    map: null,
    layers: {
        baseLayers: {},
        satellite: null,
        streets: null,
        hybrid: null,
        hybridLabels: null,
        plots: null,
        hotspots: null,
        coastalRoad: null,
        atalSetu: null,
        samruddhi: null,
        interchangeMarkers: null
    },
    selectedPlot: null,
    plots: [],
    isDrawing: false
};

// ========================================
// Initialize Application
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initLayers();
    loadPlots();
    initEventListeners();
    initLayerControls();
});

// ========================================
// Map Initialization
// ========================================
function initMap() {
    state.map = L.map('map', {
        center: CONFIG.map.center,
        zoom: CONFIG.map.zoom,
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom,
        zoomControl: true
    });

    // Position zoom control
    state.map.zoomControl.setPosition('topright');

    // Get user's location and center map
    getUserLocation();
}

// ========================================
// Geolocation - Center on User's Location
// ========================================
let userLocationMarker = null;

function getUserLocation() {
    if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        return;
    }

    // Show loading toast
    showToast('Getting your location...', 'info');

    navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            // Check if location is in Maharashtra range (roughly)
            const inMaharashtra = latitude > 15 && latitude < 23 && longitude > 72 && longitude < 81;

            if (inMaharashtra) {
                // Center map on user's location
                state.map.flyTo([latitude, longitude], 15, { duration: 1.5 });

                // Add/update location marker
                addLocationMarker(latitude, longitude, accuracy);

                showToast('Showing your current location', 'success');
            } else {
                // User is outside Maharashtra, show message but keep default view
                showToast('You are outside Maharashtra. Showing Mumbai.', 'info');
            }
        },
        // Error callback
        (error) => {
            console.log('Geolocation error:', error.message);
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    showToast('Location access denied. Using default location.', 'warning');
                    break;
                case error.POSITION_UNAVAILABLE:
                    showToast('Location unavailable. Using default location.', 'warning');
                    break;
                case error.TIMEOUT:
                    showToast('Location request timed out. Using default location.', 'warning');
                    break;
            }
        },
        // Options
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // Cache for 1 minute
        }
    );
}

function addLocationMarker(lat, lng, accuracy) {
    // Remove existing marker if present
    if (userLocationMarker) {
        state.map.removeLayer(userLocationMarker);
    }

    // Create custom location icon (blue dot like Google Maps)
    const locationIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
            <div class="location-dot">
                <div class="location-pulse"></div>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    // Add marker
    userLocationMarker = L.marker([lat, lng], { icon: locationIcon })
        .addTo(state.map)
        .bindPopup(`
            <div class="location-popup">
                <strong>📍 Your Location</strong><br>
                <small>${lat.toFixed(6)}, ${lng.toFixed(6)}</small><br>
                <small>Accuracy: ±${Math.round(accuracy)}m</small>
            </div>
        `);

    // Add accuracy circle
    if (accuracy && accuracy < 500) {
        L.circle([lat, lng], {
            radius: accuracy,
            color: '#4285f4',
            fillColor: '#4285f4',
            fillOpacity: 0.1,
            weight: 1
        }).addTo(state.map);
    }
}

// Function to re-center on user's location (for My Location button)
function goToMyLocation() {
    getUserLocation();
}

// ========================================
// Layer Initialization
// ========================================
function initLayers() {
    // Create base layers
    state.layers.satellite = L.tileLayer(CONFIG.tiles.satellite.url, {
        attribution: CONFIG.tiles.satellite.attribution,
        maxZoom: 19
    });

    state.layers.streets = L.tileLayer(CONFIG.tiles.streets.url, {
        attribution: CONFIG.tiles.streets.attribution,
        maxZoom: 19
    });

    // Add satellite as default
    state.layers.satellite.addTo(state.map);

    // Create layer groups for overlays
    state.layers.plots = L.layerGroup().addTo(state.map);
    state.layers.hotspots = L.layerGroup().addTo(state.map);
    state.layers.coastalRoad = L.layerGroup().addTo(state.map);
    state.layers.atalSetu = L.layerGroup().addTo(state.map);
    state.layers.samruddhi = L.layerGroup().addTo(state.map);
    state.layers.interchangeMarkers = L.layerGroup().addTo(state.map);

    // Add Bhuvan Cadastral WMS Layer (ISRO official cadastral boundaries)
    addBhuvanCadastralLayer();

    // Add infrastructure layers
    addInfrastructureLayers();
}

// ========================================
// Bhuvan Cadastral WMS Layer (ISRO)
// ========================================
function addBhuvanCadastralLayer() {
    // ISRO Bhuvan WMS for cadastral boundaries
    // Use local proxy to bypass CORS (run: npm start)
    // Fallback to direct URL if proxy not running

    const proxyUrl = 'http://localhost:3001/bhuvan/wms';
    const directUrl = 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms';

    // Try proxy first (assumes proxy is running on port 3001)
    const bhuvanWMS = L.tileLayer.wms(proxyUrl, {
        layers: 'cadastral',
        format: 'image/png',
        transparent: true,
        attribution: '© ISRO Bhuvan - Cadastral data',
        opacity: 0.7,
        maxZoom: 20
    });

    // Store in state
    state.layers.cadastral = bhuvanWMS;

    // Create toggle for cadastral layer
    const cadastralToggle = document.getElementById('cadastralToggle');
    if (cadastralToggle) {
        cadastralToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                bhuvanWMS.addTo(state.map);
                showToast('Showing all cadastral boundaries (ISRO Bhuvan)', 'success');
            } else {
                state.map.removeLayer(bhuvanWMS);
            }
        });

        // Add by default if toggle is checked
        if (cadastralToggle.checked) {
            bhuvanWMS.addTo(state.map);
        }
    } else {
        // Add by default if no toggle exists
        bhuvanWMS.addTo(state.map);
        console.log('Attempting to load Bhuvan cadastral layer...');

        // Error handling for WMS CORS issues
        bhuvanWMS.on('tileerror', function (error) {
            console.warn('Bhuvan WMS tile error - CORS may be blocking access');
            if (!state.cadastralErrorShown) {
                state.cadastralErrorShown = true;
                showToast('⚠️ ISRO Bhuvan cadastral layer blocked by CORS. Use Import → Bhunaksha Lookup for plot data.', 'warning');
            }
        });
    }

    // Add click handler for cadastral info
    state.map.on('click', async (e) => {
        if (state.layers.cadastral && state.map.hasLayer(state.layers.cadastral)) {
            getCadastralInfo(e.latlng);
        }
    });

    // Load locally harvested cadastral data (Devlali)
    loadLocalCadastralData();
}

// Load harvested vectors (Devlali MVP)
async function loadLocalCadastralData() {
    try {
        const response = await fetch('assets/data/devlali.json');
        if (!response.ok) return; // File might not exist yet

        const geojson = await response.json();

        // Add to map
        const localCadastral = L.geoJSON(geojson, {
            style: {
                color: '#ff9900', // Orange for harvested data
                weight: 2,
                opacity: 0.8,
                fillColor: '#ff9900',
                fillOpacity: 0.1
            },
            onEachFeature: (feature, layer) => {
                const p = feature.properties;
                layer.bindPopup(`
                    <div style="font-family: sans-serif;">
                        <strong>Survey No: ${p.survey_number}</strong><br>
                        <hr style="margin: 5px 0;">
                        GIS Code: ${p.giscode}<br>
                        Area: ${p.area} sq.m<br>
                        ${p.owner_info ? `<div style="max-height:100px; overflow-y:auto; margin-top:5px; font-size:11px;">${p.owner_info.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `);

                // Highlight on hover
                layer.on('mouseover', () => layer.setStyle({ weight: 4, fillOpacity: 0.3 }));
                layer.on('mouseout', () => layer.setStyle({ weight: 2, fillOpacity: 0.1 }));
            }
        });

        // Add to layer control if exists, or just add to map
        if (state.layers) {
            state.layers.localCadastral = localCadastral;
        }
        localCadastral.addTo(state.map);

        console.log('✅ Loaded harvested cadastral data');

        // Zoom to data if we have it
        if (geojson.features.length > 0) {
            state.map.fitBounds(localCadastral.getBounds());

            // Show toast
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(0,180,50,0.9); color:white; padding:10px 20px; border-radius:20px; z-index:9999; font-family:sans-serif; box-shadow:0 4px 12px rgba(0,0,0,0.3);';
            toast.innerText = `Loaded ${geojson.features.length} harvested plots for Devlali`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 5000);
        }

    } catch (e) {
        console.warn('Could not load local cadastral data:', e);
    }
}

// Get cadastral information from Bhuvan WMS
async function getCadastralInfo(latlng) {
    const { lat, lng } = latlng;

    // Build GetFeatureInfo request
    const bbox = state.map.getBounds();
    const size = state.map.getSize();
    const point = state.map.latLngToContainerPoint(latlng);

    const url = 'http://localhost:3001/bhuvan/wms?' + new URLSearchParams({
        service: 'WMS',
        version: '1.1.1',
        request: 'GetFeatureInfo',
        layers: 'cadastral',
        query_layers: 'cadastral',
        bbox: `${bbox.getWest()},${bbox.getSouth()},${bbox.getEast()},${bbox.getNorth()}`,
        width: size.x,
        height: size.y,
        x: Math.round(point.x),
        y: Math.round(point.y),
        srs: 'EPSG:4326',
        info_format: 'application/json'
    }).toString();

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const props = data.features[0].properties;
                showCadastralPopup(latlng, props);
            }
        }
    } catch (error) {
        // WMS GetFeatureInfo might be blocked by CORS or not available
        console.log('Cadastral info not available for this location');
    }
}

// Show popup with cadastral information
function showCadastralPopup(latlng, props) {
    const surveyNo = props.survey_no || props.SURVEY_NO || props.gat_no || props.GAT_NO || 'Unknown';
    const village = props.village || props.VILLAGE || 'Unknown';

    L.popup()
        .setLatLng(latlng)
        .setContent(`
            <div class="cadastral-popup">
                <h4>📍 Cadastral Info</h4>
                <p><strong>Survey No:</strong> ${surveyNo}</p>
                <p><strong>Village:</strong> ${village}</p>
                <p><small>Source: ISRO Bhuvan</small></p>
            </div>
        `)
        .openOn(state.map);
}

// ========================================
// Infrastructure Layers
// ========================================
function addInfrastructureLayers() {
    // Mumbai Coastal Road
    const coastalRoadLine = L.polyline(
        INFRASTRUCTURE.coastalRoad.coordinates,
        {
            color: INFRASTRUCTURE.coastalRoad.color,
            weight: 5,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round'
        }
    );
    coastalRoadLine.bindPopup(createInfraPopup(INFRASTRUCTURE.coastalRoad));
    state.layers.coastalRoad.addLayer(coastalRoadLine);

    // Coastal Road Hotspot Zone
    INFRASTRUCTURE.coastalRoad.coordinates.forEach(coord => {
        const hotspotCircle = L.circle(coord, {
            radius: INFRASTRUCTURE.coastalRoad.hotspotRadius,
            color: '#22c55e',
            weight: 1,
            opacity: 0.3,
            fillColor: CONFIG.infraColors.hotspot,
            fillOpacity: 0.2,
            dashArray: '5, 5'
        });
        state.layers.hotspots.addLayer(hotspotCircle);
    });

    // Atal Setu (MTHL)
    const atalSetuLine = L.polyline(
        INFRASTRUCTURE.atalSetu.coordinates,
        {
            color: INFRASTRUCTURE.atalSetu.color,
            weight: 5,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round'
        }
    );
    atalSetuLine.bindPopup(createInfraPopup(INFRASTRUCTURE.atalSetu));
    state.layers.atalSetu.addLayer(atalSetuLine);

    // Atal Setu Interchanges
    INFRASTRUCTURE.atalSetu.interchanges.forEach(interchange => {
        const marker = L.circleMarker(interchange.coords, {
            radius: 8,
            fillColor: INFRASTRUCTURE.atalSetu.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        });
        marker.bindPopup(`<strong>${interchange.name}</strong><br>Atal Setu Interchange`);
        state.layers.atalSetu.addLayer(marker);

        // Hotspot around interchange
        const hotspotCircle = L.circle(interchange.coords, {
            radius: INFRASTRUCTURE.atalSetu.hotspotRadius,
            color: '#22c55e',
            weight: 1,
            opacity: 0.3,
            fillColor: CONFIG.infraColors.hotspot,
            fillOpacity: 0.2,
            dashArray: '5, 5'
        });
        state.layers.hotspots.addLayer(hotspotCircle);
    });

    // Samruddhi Mahamarg
    const samruddhiLine = L.polyline(
        INFRASTRUCTURE.samruddhi.coordinates,
        {
            color: INFRASTRUCTURE.samruddhi.color,
            weight: 5,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round'
        }
    );
    samruddhiLine.bindPopup(createInfraPopup(INFRASTRUCTURE.samruddhi));
    state.layers.samruddhi.addLayer(samruddhiLine);

    // Samruddhi Interchanges
    INFRASTRUCTURE.samruddhi.interchanges.forEach(interchange => {
        const marker = L.circleMarker(interchange.coords, {
            radius: 10,
            fillColor: INFRASTRUCTURE.samruddhi.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        });
        marker.bindPopup(`
            <strong>${interchange.id}: ${interchange.name}</strong><br>
            District: ${interchange.district}<br>
            Samruddhi Mahamarg Interchange
        `);
        state.layers.samruddhi.addLayer(marker);

        // Hotspot around interchange
        const hotspotCircle = L.circle(interchange.coords, {
            radius: INFRASTRUCTURE.samruddhi.hotspotRadius,
            color: '#22c55e',
            weight: 1,
            opacity: 0.3,
            fillColor: CONFIG.infraColors.hotspot,
            fillOpacity: 0.2,
            dashArray: '5, 5'
        });
        state.layers.hotspots.addLayer(hotspotCircle);
    });
}

function createInfraPopup(infra) {
    return `
        <div style="padding: 8px;">
            <strong style="font-size: 14px; color: ${infra.color};">${infra.name}</strong>
            <br>
            <span style="color: #888; font-size: 12px;">${infra.type.toUpperCase()}</span>
            <br><br>
            <span style="font-size: 12px;">${infra.description}</span>
            <br><br>
            <span style="font-size: 11px; padding: 2px 8px; background: ${infra.color}20; color: ${infra.color}; border-radius: 4px;">
                ${infra.status}
            </span>
        </div>
    `;
}

// ========================================
// Plot Management
// ========================================
function loadPlots() {
    // 1. Load User Saved Plots (from LocalStorage)
    const savedPlots = localStorage.getItem('maharashtraPlots');
    if (savedPlots) {
        try {
            const plotData = JSON.parse(savedPlots);
            state.plots = plotData.features || [];
            renderPlots(plotData);
            console.log('Loaded user plots from storage');
        } catch (e) {
            console.error('Error loading saved plots:', e);
        }
    }

    // 2. Load Real Government Data (Devlali)
    // This loads the harvested data from assets/data/devlali.json
    loadLocalCadastralData();
}

function renderPlots(geoJson) {
    state.layers.plots.clearLayers();

    L.geoJSON(geoJson, {
        style: (feature) => getPlotStyle(feature.properties),
        onEachFeature: (feature, layer) => {
            layer.on('click', () => selectPlot(feature));
            layer.on('mouseover', (e) => {
                e.target.setStyle({
                    weight: 4,
                    fillOpacity: 0.7
                });
            });
            layer.on('mouseout', (e) => {
                if (state.selectedPlot?.properties.id !== feature.properties.id) {
                    e.target.setStyle(getPlotStyle(feature.properties));
                }
            });
        }
    }).addTo(state.layers.plots);
}

function getPlotStyle(properties) {
    let colorKey = properties.landType.toLowerCase();

    // Override based on NA status
    if (properties.naStatus === 'Pending') {
        colorKey = 'pending';
    } else if (properties.industrialNA) {
        colorKey = 'industrial';
    }

    const colors = CONFIG.plotColors[colorKey] || CONFIG.plotColors.agricultural;

    return {
        fillColor: colors.fill,
        color: colors.stroke,
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
    };
}

function selectPlot(feature) {
    state.selectedPlot = feature;

    // Update sidebar
    showPlotDetails(feature.properties);

    // Open sidebar if closed
    document.getElementById('sidebar').classList.remove('hidden');

    // Highlight selected plot
    state.layers.plots.eachLayer(layer => {
        if (layer.feature) {
            if (layer.feature.properties.id === feature.properties.id) {
                layer.setStyle({
                    weight: 4,
                    fillOpacity: 0.8
                });
            } else {
                layer.setStyle(getPlotStyle(layer.feature.properties));
            }
        }
    });
}

function showPlotDetails(properties) {
    // Hide welcome, show details
    document.getElementById('welcomeMessage').classList.add('hidden');
    document.getElementById('plotDetails').classList.remove('hidden');

    // Populate fields
    document.getElementById('surveyNumber').textContent = properties.surveyNumber;
    document.getElementById('village').textContent = properties.village;
    document.getElementById('taluka').textContent = properties.taluka;
    document.getElementById('district').textContent = properties.district;
    document.getElementById('area').textContent = properties.area;

    // Land type with badge
    const landTypeEl = document.getElementById('landType');
    landTypeEl.textContent = properties.landType;
    landTypeEl.className = 'detail-value badge badge-' + properties.landType.toLowerCase().replace(' ', '-');

    // NA Status
    const naStatusEl = document.getElementById('naStatus');
    naStatusEl.textContent = properties.naStatus;
    naStatusEl.className = 'na-status ' + properties.naStatus.toLowerCase().replace(' ', '-');

    // Industrial NA
    const industrialEl = document.getElementById('industrialNA');
    if (properties.industrialNA) {
        industrialEl.classList.remove('hidden');
    } else {
        industrialEl.classList.add('hidden');
    }

    // Owner History
    const ownerHistoryEl = document.getElementById('ownerHistory');
    ownerHistoryEl.innerHTML = '';

    if (properties.ownerHistory && properties.ownerHistory.length > 0) {
        properties.ownerHistory.forEach(owner => {
            const ownerItem = document.createElement('div');
            ownerItem.className = 'owner-item';
            ownerItem.innerHTML = `
                <span class="owner-name">${owner.name}</span>
                <span class="owner-year">${owner.year}</span>
            `;
            ownerHistoryEl.appendChild(ownerItem);
        });
    } else {
        ownerHistoryEl.innerHTML = '<p class="no-data">No ownership history available</p>';
    }

    // Calculate nearby infrastructure
    showNearbyInfrastructure(properties);
}

function showNearbyInfrastructure(properties) {
    const nearbyEl = document.getElementById('nearbyInfra');
    nearbyEl.innerHTML = '';

    // Get plot center (approximate from first coordinate)
    const plotFeature = state.plots.find(p => p.properties.id === properties.id);
    if (!plotFeature) return;

    const plotCenter = L.latLng(
        plotFeature.geometry.coordinates[0][0][1],
        plotFeature.geometry.coordinates[0][0][0]
    );

    // Calculate distances to infrastructure
    const infrastructureDistances = [];

    // Coastal Road
    let minCoastalDist = Infinity;
    INFRASTRUCTURE.coastalRoad.coordinates.forEach(coord => {
        const dist = plotCenter.distanceTo(L.latLng(coord[0], coord[1]));
        if (dist < minCoastalDist) minCoastalDist = dist;
    });
    infrastructureDistances.push({
        name: 'Coastal Road',
        distance: minCoastalDist,
        color: INFRASTRUCTURE.coastalRoad.color
    });

    // Atal Setu
    let minAtalDist = Infinity;
    INFRASTRUCTURE.atalSetu.interchanges.forEach(ic => {
        const dist = plotCenter.distanceTo(L.latLng(ic.coords[0], ic.coords[1]));
        if (dist < minAtalDist) minAtalDist = dist;
    });
    infrastructureDistances.push({
        name: 'Atal Setu',
        distance: minAtalDist,
        color: INFRASTRUCTURE.atalSetu.color
    });

    // Samruddhi
    let minSamruddhiDist = Infinity;
    INFRASTRUCTURE.samruddhi.interchanges.forEach(ic => {
        const dist = plotCenter.distanceTo(L.latLng(ic.coords[0], ic.coords[1]));
        if (dist < minSamruddhiDist) minSamruddhiDist = dist;
    });
    infrastructureDistances.push({
        name: 'Samruddhi Mahamarg',
        distance: minSamruddhiDist,
        color: INFRASTRUCTURE.samruddhi.color
    });

    // Sort by distance and render
    infrastructureDistances.sort((a, b) => a.distance - b.distance);

    infrastructureDistances.forEach(infra => {
        const item = document.createElement('div');
        item.className = 'infra-item';

        const distanceKm = (infra.distance / 1000).toFixed(1);
        const isClose = infra.distance < 5000; // Within 5km is "close"

        item.innerHTML = `
            <span class="infra-name">
                <span class="infra-dot" style="background: ${infra.color}"></span>
                ${infra.name}
            </span>
            <span class="infra-distance ${isClose ? 'close' : ''}">${distanceKm} km</span>
        `;
        nearbyEl.appendChild(item);
    });
}

// ========================================
// Event Listeners
// ========================================
function initEventListeners() {
    // Close sidebar
    document.getElementById('closeSidebar').addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('hidden');
        state.selectedPlot = null;

        // Reset plot styles
        state.layers.plots.eachLayer(layer => {
            if (layer.feature) {
                layer.setStyle(getPlotStyle(layer.feature.properties));
            }
        });
    });

    // Toggle layer panel
    document.getElementById('toggleLayerPanel').addEventListener('click', () => {
        document.getElementById('layerPanel').classList.toggle('collapsed');
    });

    // Quick navigation
    document.querySelectorAll('.quick-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const location = CONFIG.locations[btn.dataset.location];
            if (location) {
                state.map.flyTo([location.lat, location.lng], location.zoom, {
                    duration: 1.5
                });
            }
        });
    });

    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Add plot modal
    document.getElementById('addPlotBtn').addEventListener('click', () => {
        document.getElementById('addPlotModal').classList.remove('hidden');
    });

    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelAddPlot').addEventListener('click', closeModal);

    document.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Add plot form submission
    document.getElementById('addPlotForm').addEventListener('submit', handleAddPlot);
}

function closeModal() {
    document.getElementById('addPlotModal').classList.add('hidden');
    document.getElementById('addPlotForm').reset();
}

function performSearch() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) return;

    const results = state.plots.filter(plot => {
        const p = plot.properties;
        return (
            p.surveyNumber.toLowerCase().includes(query) ||
            p.village.toLowerCase().includes(query) ||
            p.taluka.toLowerCase().includes(query) ||
            p.district.toLowerCase().includes(query)
        );
    });

    if (results.length > 0) {
        // Select first result
        selectPlot(results[0]);

        // Zoom to plot
        const coords = results[0].geometry.coordinates[0];
        const center = [coords[0][1], coords[0][0]];
        state.map.flyTo(center, 15, { duration: 1 });

        showToast(`Found ${results.length} plot(s) matching "${query}"`, 'success');
    } else {
        showToast(`No plots found matching "${query}"`, 'warning');
    }
}

function handleAddPlot(e) {
    e.preventDefault();

    const formData = {
        surveyNumber: document.getElementById('formSurveyNumber').value,
        village: document.getElementById('formVillage').value,
        taluka: document.getElementById('formTaluka').value,
        district: document.getElementById('formDistrict').value,
        area: document.getElementById('formArea').value + ' Hectares',
        landType: document.getElementById('formLandType').value,
        naStatus: document.getElementById('formNAStatus').value,
        industrialNA: document.getElementById('formIndustrialNA').value === 'Yes',
        ownerHistory: document.getElementById('formOwners').value
            .split(',')
            .map(owner => {
                const match = owner.trim().match(/(.+)\s*\((\d{4})\)/);
                return match ? { name: match[1].trim(), year: match[2] } : null;
            })
            .filter(Boolean)
    };

    // Parse coordinates or use default near Mumbai
    let coordinates;
    const coordsInput = document.getElementById('formCoordinates').value.trim();

    if (coordsInput) {
        try {
            coordinates = JSON.parse(coordsInput);
        } catch (e) {
            showToast('Invalid coordinates format', 'error');
            return;
        }
    } else {
        // Default coordinates (small plot near Thane)
        const baseLat = 19.2 + Math.random() * 0.1;
        const baseLng = 73.0 + Math.random() * 0.1;
        coordinates = [[
            [baseLng, baseLat],
            [baseLng + 0.005, baseLat],
            [baseLng + 0.005, baseLat - 0.005],
            [baseLng, baseLat - 0.005],
            [baseLng, baseLat]
        ]];
    }

    // Create new plot feature
    const newPlot = {
        type: 'Feature',
        properties: {
            id: 'plot-' + Date.now(),
            ...formData
        },
        geometry: {
            type: 'Polygon',
            coordinates: coordinates
        }
    };

    // Add to state
    state.plots.push(newPlot);

    // Save to localStorage
    const plotData = {
        type: 'FeatureCollection',
        features: state.plots
    };
    localStorage.setItem('maharashtraPlots', JSON.stringify(plotData));

    // Re-render plots
    renderPlots(plotData);

    // Close modal and show success
    closeModal();
    showToast('Plot added successfully!', 'success');

    // Select the new plot
    selectPlot(newPlot);

    // Zoom to new plot
    state.map.flyTo([coordinates[0][0][1], coordinates[0][0][0]], 14, { duration: 1 });
}

// ========================================
// Layer Controls
// ========================================
function initLayerControls() {
    // Base layer switching
    document.querySelectorAll('input[name="baseLayer"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            switchBaseLayer(e.target.value);
        });
    });

    // Overlay toggles
    document.getElementById('layerPlots').addEventListener('change', (e) => {
        toggleLayer(state.layers.plots, e.target.checked);
    });

    document.getElementById('layerHotspots').addEventListener('change', (e) => {
        toggleLayer(state.layers.hotspots, e.target.checked);
    });

    document.getElementById('layerCoastalRoad').addEventListener('change', (e) => {
        toggleLayer(state.layers.coastalRoad, e.target.checked);
    });

    document.getElementById('layerAtalSetu').addEventListener('change', (e) => {
        toggleLayer(state.layers.atalSetu, e.target.checked);
    });

    document.getElementById('layerSamruddhi').addEventListener('change', (e) => {
        toggleLayer(state.layers.samruddhi, e.target.checked);
    });
}

function switchBaseLayer(layerType) {
    // Remove all base layers
    if (state.map.hasLayer(state.layers.satellite)) {
        state.map.removeLayer(state.layers.satellite);
    }
    if (state.map.hasLayer(state.layers.streets)) {
        state.map.removeLayer(state.layers.streets);
    }
    if (state.layers.hybridLabels && state.map.hasLayer(state.layers.hybridLabels)) {
        state.map.removeLayer(state.layers.hybridLabels);
    }

    // Add selected layer
    switch (layerType) {
        case 'satellite':
            state.layers.satellite.addTo(state.map);
            break;
        case 'streets':
            state.layers.streets.addTo(state.map);
            break;
        case 'hybrid':
            state.layers.satellite.addTo(state.map);
            // Add labels layer for hybrid
            if (!state.layers.hybridLabels) {
                state.layers.hybridLabels = L.tileLayer(
                    'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
                    { attribution: '&copy; <a href="https://carto.com/">CARTO</a>', pane: 'overlayPane' }
                );
            }
            state.layers.hybridLabels.addTo(state.map);
            break;
    }
}

function toggleLayer(layer, visible) {
    if (visible) {
        if (!state.map.hasLayer(layer)) {
            layer.addTo(state.map);
        }
    } else {
        if (state.map.hasLayer(layer)) {
            state.map.removeLayer(layer);
        }
    }
}

// ========================================
// Toast Notifications
// ========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ========================================
// Utility Functions
// ========================================
function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ========================================
// Import Functionality
// ========================================
let pendingImportData = null;

function initImportModal() {
    const importModal = document.getElementById('importModal');
    const importBtn = document.getElementById('importBtn');
    const closeImportModal = document.getElementById('closeImportModal');
    const cancelImport = document.getElementById('cancelImport');
    const confirmImport = document.getElementById('confirmImport');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const clearFile = document.getElementById('clearFile');
    const parseManualBtn = document.getElementById('parseManualBtn');

    // Open modal
    importBtn.addEventListener('click', () => {
        importModal.classList.remove('hidden');
    });

    // Close modal
    const closeImportModalFn = () => {
        importModal.classList.add('hidden');
        resetImportState();
    };

    closeImportModal.addEventListener('click', closeImportModalFn);
    cancelImport.addEventListener('click', closeImportModalFn);
    document.querySelector('#importModal .modal-overlay').addEventListener('click', closeImportModalFn);

    // Tab switching
    document.querySelectorAll('.import-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            // Update tab buttons
            document.querySelectorAll('.import-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update tab content
            document.querySelectorAll('.import-tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
        });
    });

    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Clear file
    clearFile.addEventListener('click', resetImportState);

    // Parse manual GeoJSON
    parseManualBtn.addEventListener('click', () => {
        const geoJsonText = document.getElementById('manualGeoJson').value.trim();
        if (!geoJsonText) {
            showToast('Please enter GeoJSON data', 'error');
            return;
        }
        try {
            const parsed = JSON.parse(geoJsonText);
            pendingImportData = normalizeGeoJSON(parsed);
            document.getElementById('confirmImport').disabled = false;
            showToast(`Parsed ${pendingImportData.features.length} plot(s)`, 'success');
        } catch (err) {
            showToast('Invalid JSON format: ' + err.message, 'error');
        }
    });

    // Confirm import
    confirmImport.addEventListener('click', () => {
        if (!pendingImportData || pendingImportData.features.length === 0) {
            showToast('No data to import', 'error');
            return;
        }
        importPlots(pendingImportData);
        closeImportModalFn();
    });
}

function handleFile(file) {
    const fileName = file.name.toLowerCase();
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('filePreview').classList.remove('hidden');

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        document.getElementById('previewContent').textContent = content.substring(0, 500) + (content.length > 500 ? '...' : '');

        try {
            if (fileName.endsWith('.json') || fileName.endsWith('.geojson')) {
                const parsed = JSON.parse(content);
                pendingImportData = normalizeGeoJSON(parsed);
            } else if (fileName.endsWith('.csv')) {
                pendingImportData = parseCSV(content);
            } else {
                throw new Error('Unsupported file format');
            }

            document.getElementById('confirmImport').disabled = false;
            showToast(`Ready to import ${pendingImportData.features.length} plot(s)`, 'success');
        } catch (err) {
            showToast('Error parsing file: ' + err.message, 'error');
            document.getElementById('confirmImport').disabled = true;
        }
    };
    reader.readAsText(file);
}

function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    const features = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < 10) continue; // Need at least basic fields + 4 coordinates

        const row = {};
        headers.forEach((h, idx) => row[h] = values[idx]);

        // Extract coordinates (expects lat1,lng1,lat2,lng2,lat3,lng3,lat4,lng4)
        const coords = [];
        for (let j = 8; j < values.length; j += 2) {
            const lat = parseFloat(values[j]);
            const lng = parseFloat(values[j + 1]);
            if (!isNaN(lat) && !isNaN(lng)) {
                coords.push([lng, lat]); // GeoJSON uses [lng, lat]
            }
        }

        // Close the polygon
        if (coords.length >= 3) {
            coords.push([...coords[0]]);
        }

        if (coords.length >= 4) {
            features.push({
                type: 'Feature',
                properties: {
                    id: 'plot-' + Date.now() + '-' + i,
                    surveyNumber: row.surveynumber || row['survey number'] || 'Unknown',
                    village: row.village || 'Unknown',
                    taluka: row.taluka || 'Unknown',
                    district: row.district || 'Unknown',
                    area: (row.area || '0') + ' Hectares',
                    landType: row.landtype || row['land type'] || 'Agricultural',
                    naStatus: row.nastatus || row['na status'] || 'Not Applied',
                    industrialNA: (row.industrialna || row['industrial na'] || 'no').toLowerCase() === 'yes',
                    ownerHistory: []
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [coords]
                }
            });
        }
    }

    return {
        type: 'FeatureCollection',
        features: features
    };
}

function normalizeGeoJSON(data) {
    // Handle single Feature
    if (data.type === 'Feature') {
        return {
            type: 'FeatureCollection',
            features: [normalizeFeature(data)]
        };
    }

    // Handle FeatureCollection
    if (data.type === 'FeatureCollection') {
        return {
            type: 'FeatureCollection',
            features: data.features.map(f => normalizeFeature(f))
        };
    }

    throw new Error('Invalid GeoJSON: must be Feature or FeatureCollection');
}

function normalizeFeature(feature) {
    const props = feature.properties || {};
    return {
        type: 'Feature',
        properties: {
            id: props.id || 'plot-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            surveyNumber: props.surveyNumber || props.survey_number || props.gat_number || 'Unknown',
            village: props.village || props.gaon || 'Unknown',
            taluka: props.taluka || 'Unknown',
            district: props.district || props.jilla || 'Unknown',
            area: props.area || '0 Hectares',
            landType: props.landType || props.land_type || 'Agricultural',
            naStatus: props.naStatus || props.na_status || 'Not Applied',
            industrialNA: props.industrialNA || props.industrial_na || false,
            ownerHistory: props.ownerHistory || props.owners || []
        },
        geometry: feature.geometry
    };
}

function importPlots(geoJson) {
    // Add to state
    geoJson.features.forEach(feature => {
        state.plots.push(feature);
    });

    // Save to localStorage
    const plotData = {
        type: 'FeatureCollection',
        features: state.plots
    };
    localStorage.setItem('maharashtraPlots', JSON.stringify(plotData));

    // Re-render
    renderPlots(plotData);

    // Zoom to imported plots
    if (geoJson.features.length > 0) {
        const firstPlot = geoJson.features[0];
        const coords = firstPlot.geometry.coordinates[0][0];
        state.map.flyTo([coords[1], coords[0]], 14, { duration: 1 });
    }

    showToast(`Successfully imported ${geoJson.features.length} plot(s)!`, 'success');
}

function resetImportState() {
    pendingImportData = null;
    document.getElementById('filePreview').classList.add('hidden');
    document.getElementById('fileInput').value = '';
    document.getElementById('manualGeoJson').value = '';
    document.getElementById('confirmImport').disabled = true;
    document.getElementById('previewContent').textContent = '';
}

// Initialize import modal on page load
document.addEventListener('DOMContentLoaded', () => {
    initImportModal();

    // My Location button
    const myLocationBtn = document.getElementById('myLocationBtn');
    if (myLocationBtn) {
        myLocationBtn.addEventListener('click', goToMyLocation);
    }
});


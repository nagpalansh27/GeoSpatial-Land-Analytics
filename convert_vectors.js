const fs = require('fs-extra');
const path = require('path');
const wellknown = require('wellknown'); // WKT parser
const proj4 = require('proj4');

// Define Projections
// Nashik is in UTM Zone 43N typically.
// Source: UTM Zone 43N (EPSG:32643)
const UTM_43N = "+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs";
const WGS84 = "+proj=longlat +datum=WGS84 +no_defs";

const HARVEST_DIR = path.join(__dirname, 'harvest');
const OUTPUT_FILE = path.join(__dirname, 'assets', 'data', 'devlali.json');

async function convert() {
    console.log('🔄 Starting Conversion: WKT/UTM -> GeoJSON/LatLong');

    await fs.ensureDir(path.dirname(OUTPUT_FILE));

    const files = await fs.readdir(HARVEST_DIR);
    const jsonFiles = files.filter(f => f.startsWith('capture_') && f.endsWith('.json'));

    const features = [];

    for (const file of jsonFiles) {
        try {
            const content = await fs.readJson(path.join(HARVEST_DIR, file));

            // Validate it has geometry
            if (!content.the_geom && !content.geometry) continue;

            // 1. Parse WKT to GeoJSON Geometry
            let geometry = null;
            if (content.the_geom) {
                geometry = wellknown(content.the_geom);
            }

            if (!geometry) continue;

            // 2. Reproject Coordinates (UTM -> LatLng)
            // geometry.coordinates is deeply nested [[[x,y], [x,y]]]
            const reproject = (coords) => {
                if (typeof coords[0] === 'number') {
                    // It's a point pair [x, y]
                    return proj4(UTM_43N, WGS84, coords);
                } else {
                    return coords.map(reproject);
                }
            };

            geometry.coordinates = reproject(geometry.coordinates);

            // 3. Create Feature
            const feature = {
                type: 'Feature',
                properties: {
                    survey_number: content.plotno || content.survey_no,
                    owner_info: content.info || '',
                    gis_code: content.giscode,
                    ...content
                },
                geometry: geometry
            };

            // Remove massive WKT string from properties to save space
            delete feature.properties.the_geom;

            features.push(feature);
            console.log(`   ✅ Converted Plot: ${feature.properties.survey_number}`);

        } catch (e) {
            console.warn(`   ⚠️ Error processing ${file}: ${e.message}`);
        }
    }

    const collection = {
        type: 'FeatureCollection',
        features: features
    };

    await fs.outputJson(OUTPUT_FILE, collection, { spaces: 0 }); // Minified
    console.log(`🎉 Saved ${features.length} plots to ${OUTPUT_FILE}`);
}

convert();

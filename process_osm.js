const fs = require('fs');

const data = JSON.parse(fs.readFileSync('atal_setu.json', 'utf8'));
const members = data.elements[0].members;

let coords = [];

members.forEach(member => {
    if (member.geometry) {
        member.geometry.forEach(pt => {
            coords.push(`[${pt.lat}, ${pt.lon}]`);
        });
    }
});

// Remove duplicates (consecutive)
coords = coords.filter((item, pos, arr) => !pos || item !== arr[pos - 1]);

// Simplify (take every 5th point to reduce size but keep valid curve)
// The bridge is 21km, so thousands of points might be too much for a simple polyline in JS text
// But let's see the count first.
console.log(`Total points: ${coords.length}`);

const simplified = coords.filter((_, i) => i % 2 === 0); // Take every 2nd point for now
console.log(`Simplified points: ${simplified.length}`);

console.log('[\n' + simplified.join(',\n') + '\n]');

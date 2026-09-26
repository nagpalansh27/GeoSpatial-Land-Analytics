# GeoSpatial Land Analytics &bull; Interactive Vector Mapping Engine

[![Live Web Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://geospatial-land-analytics.vercel.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![GIS](https://img.shields.io/badge/GIS-OpenStreetMap%20%7C%20GeoJSON-green?style=for-the-badge)](https://openstreetmap.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A production-grade Web GIS and geospatial property intelligence platform designed to render, query, and analyze high-density land boundaries, municipal infrastructure vectors (e.g. Mumbai Atal Setu corridor), and cadastral property records directly in the browser.

🌐 **Instant Live Web Demo**: **[geospatial-land-analytics.vercel.app](https://geospatial-land-analytics.vercel.app)**

---

## 🏛️ System Architecture & Data Pipeline

```
[ Government Cadastral & Land Records (CSV / GeoJSON) ]
                         │
                         ▼
             [ Vector ETL Pipeline ]
        (process_osm.js & convert_vectors.js)
                         │
                         ▼
        [ Geospatial Boundary Indexing ]
        (atal_setu.json & sample_plots.csv)
                         │
                         ▼
      [ Client-Side Interactive Map Engine ]
            (Leaflet / OpenStreetMap / app.js)
                         │
                         ▼
     [ User Query & Property Valuation HUD ]
```

---

## 📂 Project Structure & Key Files

```
GeoSpatial-Land-Analytics/
├── index.html           # P0: Main interactive geospatial map interface
├── app.js               # P0: Client-side vector rendering, plot selection & calculation engine
├── styles.css           # P1: UI styling, dark HUD theme, and sidebar layout
├── atal_setu.json       # P0: High-resolution GIS vector coordinates for corridor infrastructure
├── sample_plots.csv     # P1: Sample cadastral plot records, survey numbers & area valuations
├── convert_vectors.js   # P1: Utility script to transform raw OSM nodes into clean GeoJSON
├── process_osm.js       # P1: OpenStreetMap raw XML/PBF data parser
├── proxy-server.js      # P2: Optional local Node.js proxy for CORS-restricted municipal endpoints
└── README.md            # P1: System documentation & AI tweaking guide
```

---

## 🚀 How to Run & Deploy

### 1. Web Application (Zero Install / Instant)
- **Live Vercel Production**: [geospatial-land-analytics.vercel.app](https://geospatial-land-analytics.vercel.app)
- **Local Testing**: Double-click `index.html` or run `npx serve .`

### 2. Running Local Node Proxy (Optional)
```bash
npm install
node proxy-server.js
```

---

## 🤖 AI & Developer Tweaking Cheatsheet

If an AI agent or developer is modifying this tool, follow these exact guidelines:

| File | Component | What to Tweak | How to Modify |
| :--- | :--- | :--- | :--- |
| `app.js` | Default Map Center | Adjust starting latitude/longitude and zoom | Modify `map.setView([lat, lon], zoomLevel)` in initialization. |
| `app.js` | Vector Layer Styles | Change boundary colors, stroke weight, opacity | Update `style: function(feature)` in the GeoJSON loader. |
| `atal_setu.json` | Infrastructure Polygons | Add or update regional road/bridge coordinates | Append GeoJSON Feature objects to the `features` array. |
| `sample_plots.csv` | Land Parcel Data | Update valuation rates, zone classification | Add new rows following `plot_id, survey_no, area_sqm, valuation`. |

# Folder GIS — Bogor Livable City

Folder kerja GIS Developer (WBS 1.3.x). Berisi skrip pemrosesan data spasial
yang menghasilkan file GeoJSON untuk WebGIS di `public/data/`.

- `source/` — data mentah (GeoPackage hasil QGIS, Shapefile RBI BIG 1:25K). Tidak di-commit.
- `build-data.ps1` — skrip ekspor/analisis (ogr2ogr dari QGIS) → `public/data/*.geojson`.


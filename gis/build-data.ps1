<#
  Bogor Livable City — pipeline data GIS (WBS 1.3.x)
  Menghasilkan GeoJSON (EPSG:4326, RFC 7946) untuk WebGIS di public/data/.

  Pemakaian (PowerShell):
    .\gis\build-data.ps1
    .\gis\build-data.ps1 -Gpkg "D:\...\livable_kelurahan_v3_lengkap.gpkg" -Rbi "D:\...\KOTA BOGOR" -Out ".\public\data"

  Butuh QGIS (ogr2ogr + SpatiaLite) — default: C:\Program Files\QGIS 3.44.15\bin
#>
param(
  [string]$Gpkg  = "D:\Zaidan Semester 5\Sistem Informasi Geografis\livable_kelurahan_v3_lengkap.gpkg",
  [string]$Rbi   = "D:\Zaidan Semester 5\Sistem Informasi Geografis\Dataset Bogor-20260904\KOTA BOGOR\KOTA BOGOR",
  [string]$Out   = (Join-Path $PSScriptRoot "..\public\data"),
  [string]$QgisBin = "C:\Program Files\QGIS 3.44.15\bin"
)
$ErrorActionPreference = "Stop"
$ogr = Join-Path $QgisBin "ogr2ogr.exe"
$sql = Join-Path $PSScriptRoot "sql"
New-Item -ItemType Directory -Force $Out | Out-Null

function Export([string]$src, [string]$sqlFile, [string]$name, [string[]]$extra) {
  $dst = Join-Path $Out "$name.geojson"
  if (Test-Path $dst) { Remove-Item $dst }
  $args = @("-f", "GeoJSON", $dst, $src, "-dialect", "SQLite", "-sql", "@$(Join-Path $sql $sqlFile)",
            "-nln", $name, "-t_srs", "EPSG:4326", "-lco", "RFC7946=YES", "-lco", "WRITE_NAME=NO") + $extra
  & $ogr @args
  if ($LASTEXITCODE -ne 0) { throw "Gagal membuat $name" }
  "{0,-34} {1,8:N0} KB" -f "$name.geojson", ((Get-Item $dst).Length / 1KB)
}

# 1.3.4 Agregasi indikator ke kelurahan (poligon choropleth)
Export $Gpkg "kelurahan.sql" "kelurahan" @("-nlt", "MULTIPOLYGON", "-simplify", "0.00003", "-lco", "COORDINATE_PRECISION=6")
# Batas kecamatan
Export $Gpkg "kecamatan.sql" "kecamatan" @("-nlt", "MULTIPOLYGON", "-simplify", "0.00003", "-lco", "COORDINATE_PRECISION=6")
# 1.3.2 Buffer jangkauan faskes + blank spot (nama file sesuai WBS Dictionary)
Export $Gpkg "jangkauan_faskes.sql" "JANGKAUAN_PUSKESMAS_RUMAHSAKIT" @("-nlt", "MULTIPOLYGON", "-simplify", "0.00003", "-lco", "COORDINATE_PRECISION=6")
# Titik fasilitas
Export $Gpkg "faskes.sql"  "faskes"  @("-nlt", "POINT", "-lco", "COORDINATE_PRECISION=6")
Export $Gpkg "sekolah.sql" "sekolah" @("-nlt", "POINT", "-lco", "COORDINATE_PRECISION=6")
# Jaringan jalan RBI
Export (Join-Path $Rbi "JALAN_LN_25K.shp") "jalan.sql" "jalan" @("-nlt", "MULTILINESTRING", "-simplify", "0.00005", "-lco", "COORDINATE_PRECISION=5")

"Selesai -> $((Resolve-Path $Out).Path)"


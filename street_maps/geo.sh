docker run -it \
  -e PBF_URL=https://download.geofabrik.de/north-america/us/louisiana-latest.osm.pbf \
  -p 8080:8080 \
  --name nominatim \
  mediagis/nominatim:4.5

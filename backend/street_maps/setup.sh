#Make sure Docker is installed and the map data is present
#Also need root permissions
#https://download.geofabrik.de/north-america/us/louisiana-latest.osm.pbf************************************************************************

#Download latets version of Louisiana data
wget https://download.geofabrik.de/north-america/us/louisiana-latest.osm.pbf

#Create volume install container and import volumes
docker volume create osm-data

docker run -v ./Louisiana.osm.pbf:/data/region.osm.pbf -v osm-data:/data/database/ overv/openstreetmap-tile-server import

#Start server and start on boot
docker run --rm --restart always docker run -p 8080:80 -v osm-data:/data/database -d overv/openstreetmap-tile-server run

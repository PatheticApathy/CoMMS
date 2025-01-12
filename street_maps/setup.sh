#Make sure Docker is installed and the map data is present
#Also need root permissions

#Create volume install container and import volumes
docker volume create osm-data
docker run -v ./osm_data/62c14118-cdad-476f-929d-4c81f135ebf5_Louisiana.osm.pbf:/data/region.osm.pbf -v osm-data:/data/database/ overv/openstreetmap-tile-server import

##copy to systemd to run on boot
cp ./map.service /etc/systemd/system/
chmod 664 /etc/systemd/system/map.service

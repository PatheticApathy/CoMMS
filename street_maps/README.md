# OSM Startup Guide

This file contains everything needed to start an instance of the open street maps
and start it on boot.

## Prerequisites

Docker and the map data in this file.

## Quick Start

1. Download the slice form OSM by the slice and rename it to `Louisiana.osm.pbf`
2. Run the setup script.
   <br>

```bash
bash setup.sh
```

<br>

If something goes wrong and you don't see something like "INFO:root: Import complete"
You'll need to remove the docker container and volume named "osm-data", then restart the script.


3. To run
   `systemctl start map.service` to run start at boot,
   `systemctl enable map.service`

Now check the http address `http://your.server.ip.address:8080/tile/0/0/0.png`.
A zoomable map should be at `http://your.server.ip.address:8080`.

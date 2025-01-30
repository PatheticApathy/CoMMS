# OSM Startup Guide

This file contains everything needed to start an instance of the open street maps
and start it on boot.

> [!NOTE]
> Plan is to switch all this over to a simple docker compose file

## Prerequisites

Docker and the map data in this file.

## Quick Start for production

### Map Of Louisiana

Run the setup script.
<br>

```bash
bash setup.sh
```

<br>

If something goes wrong and you don't see something like "INFO:root: Import complete"
You'll need to remove the docker container and volume named "osm-data", then restart the script.


Now check the http address `http://your.server.ip.address:8080/tile/0/0/0.png`.
A zoomable map should be at `http://your.server.ip.address:8080`.
<<<<<<< Updated upstream
=======

### Geocoding services

Run the setup script.
<br>

```bash
bash geo.sh
```

You should be able to

```Bash
`curl localhost/search\?q\=Louisiana\&format\=json`
```
>>>>>>> Stashed changes

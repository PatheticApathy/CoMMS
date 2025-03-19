"use client";

import L, { LatLngBoundsExpression } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, Polygon, Rectangle  } from "react-leaflet";
import { Jobsite } from '@/material-api-types';
import "leaflet/dist/leaflet.css";
import Link from "next/link";

const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Anchor point of the icon (where the tip is placed)
    popupAnchor: [1, -34], // Position of the popup relative to the icon
});

const bounds : LatLngBoundsExpression = [
  [32.5260072, -92.6440465],
  [32.5266895, -92.6427248]
]

export default function JobsiteMapClient({ jobsite }: { jobsite: Jobsite}) {
  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={[32.53,-92.63]}
      zoom={14}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[jobsite.location_lat.Valid ? jobsite.location_lat.Float64 : 0.0,jobsite.location_lng.Valid ? jobsite.location_lng.Float64 : 0.0]} icon={defaultIcon}>
        <Popup>
          <Link href="https://coes.latech.edu">The IESB</Link>
        </Popup>
      </Marker>
      <Rectangle pathOptions={{color: "purple"}} bounds={bounds}/>      
    </MapContainer>
  );
}

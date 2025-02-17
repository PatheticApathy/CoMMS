"use client";

import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Anchor point of the icon (where the tip is placed)
    popupAnchor: [1, -34], // Position of the popup relative to the icon
});

export default function JobsiteMapClient() {
  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[51.505, -0.09]} icon={defaultIcon}>
        <Popup>
            A pretty CSS3 popup.<br />Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

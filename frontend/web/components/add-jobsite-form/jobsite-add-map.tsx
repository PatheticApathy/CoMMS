/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { UseFormReturn } from "react-hook-form";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

async function fetchCoordsFromAddress(address: string) {
  const baseUrl = process.env.NOMIN || "https://nominatim.openstreetmap.org";
  const encoded = encodeURIComponent(address);
  const url = `${baseUrl}/search?format=json&q=${encoded}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "CoMMS (mjl036@gmail.com)",
    },
  });

  if (!res.ok) throw new Error("Nominatim request failed");

  const data = await res.json();
  if (data.length === 0) throw new Error("No results found");

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

function Recenter({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 17);
  }, [coords, map]);
  return null;
}

export default function AddJobsiteMap({form} : {form: UseFormReturn<any>}) {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!address) return;

    fetchCoordsFromAddress(address)
      .then(({ lat, lng }) => setCoords([lat, lng]))
      .catch((err) => console.error("Geocode failed:", err));
  }, [address]);

  return (
    <div className="w-full h-[300px]">
      <input
        type="text"
        className="mb-2 p-2 border rounded w-full"
        placeholder="Enter address..."
        value={address}
        onChange={(e) => {
            setAddress(e.target.value)
            console.log(address)
            form.setValue('addr', address)
            if (coords && coords.length > 0){
              console.log(coords[0])
              form.setValue('location_lat', coords[0])
              console.log(coords[1])
              form.setValue('location_lng', coords[1])
            }
        }}
      />
      {coords && (
        <MapContainer center={coords} zoom={17} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={coords} icon={defaultIcon} />
          <Recenter coords={coords} />
        </MapContainer>
      )}
    </div>
  );
}

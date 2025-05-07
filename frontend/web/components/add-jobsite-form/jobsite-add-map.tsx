/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";

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

export default function AddJobsiteMap({ form }: { form: UseFormReturn<any> }) {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<[number, number] | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchCoordsFromAddress(address)
        .then(({ lat, lng }) => {
          setCoords([lat, lng]);
          form.setValue("location_lat", lat);
          form.setValue("location_lng", lng);
          form.setValue("addr", address);
        })
        .catch((err) => console.error("Geocode failed:", err));
    }
  };

  return (
    <div className="w-full h-[300px]">
      <div className="mb-2 p-2 w-full flex flex-row">
      <input
        type="text"
        className="mb-2 p-2 border rounded basis-3/4"
        placeholder="Enter address..."
        value={address}
        onChange={(e) => setAddress(e.target.value)} // Update address state without triggering API call
        // Trigger API call only on Enter key press
      />
      <Button variant='yellow' type='button' className="mb-2 p-6 basis-1/4" onClick={() => handleKeyDown}>Find</Button>
      </div>
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

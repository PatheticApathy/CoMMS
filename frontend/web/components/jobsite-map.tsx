"use client";

import L, { LatLngBoundsExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Rectangle, GeoJSON } from "react-leaflet";
import useSWR, {Fetcher} from "swr";
import { JobSite, User } from "@/user-api-types";
import { getToken } from "@/components/localstorage";
import { Token } from "@/user-api-types";
import { Material } from '@/material-api-types';
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const jobSiteFetcher = async (url: string): Promise<JobSite[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch job sites");
  return res.json();
};

const materialFetcher: Fetcher<Material[], string> = async (...args) => fetch(...args,).then(res => res.json())

const userFetcher = async (url: string): Promise<User[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

async function getProfileArgs(url: string, arg: string) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: arg,
  }).then((res) => res.json() as Promise<Token>);
}

async function fetchNominatimZone(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&polygon_geojson=1`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "CoMMS (mjl036@gmail.com)", // Required by Nominatim TOS
    },
  });
  if (!res.ok) throw new Error("Failed to fetch from Nominatim");
  return res.json();
}

function createFixedBoundingBox(lat: number, lon: number, meters: number): LatLngBoundsExpression {
  const offset = meters / 111320; // ~degrees per meter
  return [
    [lat - offset, lon - offset],
    [lat + offset, lon + offset],
  ];
}

export default function JobsiteMapClient() {
  const token = getToken();

  const { data: sites } = useSWR<JobSite[]>("/api/sites/all", jobSiteFetcher);
  const { data: users } = useSWR<User[]>("/api/user/all", userFetcher);
  const { data: tokenData, error: error2 } = useSWR( token ? ["/api/user/decrypt", token] : null, ([url, token]) => getProfileArgs(url, token));

  const [bboxZone, setBboxZone] = useState<LatLngBoundsExpression | null>(null);
  const [zonePolygon, setZonePolygon] = useState<any | null>(null);

  const userID = tokenData?.id;
  const user = userID ? users?.[userID - 1] : null;
  const site = user?.jobsite_id?.Int64 ? sites?.[user.jobsite_id.Int64 - 1] : null;

  const { data: materials, error, isLoading } = useSWR(user ? `/api/material/material/search?site=${user.jobsite_id.Valid ? user.jobsite_id.Int64 : undefined}` : null, materialFetcher)

  const lat = site?.location_lat?.Float64;
  const lng = site?.location_lng?.Float64;

  useEffect(() => {
    if (lat && lng) {
      fetchNominatimZone(lat, lng)
        .then((data) => {
          if (data.geojson && data.geojson.type === "Polygon") {
            setZonePolygon(data.geojson);
            setBboxZone(null);
          } else if (data.boundingbox) {
            const [south, north, west, east] = data.boundingbox.map(parseFloat);
            setBboxZone([
              [south, west],
              [north, east],
            ]);
            setZonePolygon(null);
          } else {
            setBboxZone(createFixedBoundingBox(lat, lng, 150)); // 50m fallback
            setZonePolygon(null);
          }
        })
        .catch((err) => {
          console.error("Nominatim error:", err);
          setBboxZone(createFixedBoundingBox(lat, lng, 150));
          setZonePolygon(null);
        });
    }
  }, [lat, lng]);

  if (!token) {
    return <p className="flex items-center justify-center w-screen h-screen">Invalid Token</p>;
  }

  if (error) {
    return <p className="flex items-center justify-center w-screen h-screen">{error.message}</p>;
  }

  if (error2) {
    return <p className="flex items-center justify-center w-screen h-screen">{error2.message}</p>;
  }

  if (!sites || !users || !userID || !site || !lat || !lng || isLoading) {
    return <p className="flex items-center justify-center w-screen h-screen">Loading...</p>;
  }

  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={[lat, lng]}
      zoom={17}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Marker is optional */}
      <Marker position={[lat, lng]} icon={defaultIcon}>
        <Popup>{site.name}</Popup>
      </Marker>

      {/* Preferred: GeoJSON shape (if available) */}
      {zonePolygon && (
        <GeoJSON data={zonePolygon} style={{ color: "purple", weight: 2 }} />
      )}

      {/* Fallback: bounding box or fixed square */}
      {!zonePolygon && bboxZone && (
        <Rectangle pathOptions={{ color: "purple" }} bounds={bboxZone} />
      )}
    </MapContainer>
  );
}

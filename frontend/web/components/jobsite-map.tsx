/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import L, { LatLngBoundsExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Rectangle, GeoJSON } from "react-leaflet";
import useSWR, {Fetcher} from "swr";
import { GetUserRow, JobSite } from "@/user-api-types";
import { getToken, IdentityContext } from "@/components/identity-provider";
import { Material } from '@/material-api-types';
import { useContext, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const jobSiteFetcher = async (url: string): Promise<JobSite> => {
  const res = await fetch(url, {
    headers: { 'Authorization': getToken()}
  });
  if (!res.ok) throw new Error("Failed to fetch job sites");
  return res.json();
};

const materialFetcher: Fetcher<Material[], string> = async (...args) => fetch(...args, {headers: { 'Authorization': getToken()}}).then(res => res.json())

const fetchUser = async  (url: string): Promise<GetUserRow[]> => {
  const res = await fetch(url,
    { headers: { 'authorization': getToken() || 'bruh' } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

async function fetchNominatimZone(lat: number, lon: number) {
  const baseUrl = process.env.NOMIN || "https://nominatim.openstreetmap.org";
  const url = `${baseUrl}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&polygon_geojson=1`;
  console.log("Calling Nominatim with:", url);
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
  const identity = useContext(IdentityContext)

  const { data: currentUser, error: error } = useSWR<GetUserRow[]>(identity ? `/api/user/search?id=${identity?.id}` : null, fetchUser);
  const { data: currentSite, error: error2 } = useSWR<JobSite>(currentUser && currentUser[0].jobsite_id.Valid ? `/api/sites/search?id=${currentUser[0].jobsite_id.Int64}` : null, jobSiteFetcher);

  const [bboxZone, setBboxZone] = useState<LatLngBoundsExpression | null>(null);
  const [zonePolygon, setZonePolygon] = useState<any | null>(null);

  const { data: materials, error: error3, isLoading } = useSWR(currentUser ? `/api/material/material/search?site=${currentUser[0].jobsite_id.Valid ? currentUser[0].jobsite_id.Int64 : undefined}` : null, materialFetcher)
  console.log(materials)

  const lat = currentSite?.location_lat?.Float64;
  const lng = currentSite?.location_lng?.Float64;

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
            setBboxZone(createFixedBoundingBox(lat, lng, 100)); // 50m fallback
            setZonePolygon(null);
          }
        })
        .catch((err) => {
          console.error("Nominatim error:", err);
          setBboxZone(createFixedBoundingBox(lat, lng, 100));
          setZonePolygon(null);
        });
    }
  }, [lat, lng]);

  if (!identity) {
    return <p className="flex items-center justify-center w-screen h-screen">Invalid Token</p>;
  }

  if (error) {
    return <p className="flex items-center justify-center w-screen h-screen">{error.message}</p>;
  }

  if (error2) {
    return <p className="flex items-center justify-center w-screen h-screen">{error2.message}</p>;
  }

  if (error3) {
    return <p className="flex items-center justify-center w-screen h-screen">{error3.message}</p>;
  }

  if (!currentUser || !currentSite || !lat || !lng || isLoading) {
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

      {zonePolygon && (
        <GeoJSON data={zonePolygon} style={{ color: "purple", weight: 2 }} />
      )}

      {/* Fallback: bounding box or fixed square */}
      {!zonePolygon && bboxZone && (
        <Rectangle pathOptions={{ color: "purple" }} bounds={bboxZone} />
      )}

      {materials?.map((mat) => {
        const hasCoords =
          mat.location_lat?.Valid &&
          mat.location_lng?.Valid &&
          typeof mat.location_lat.Float64 === "number" &&
          typeof mat.location_lng.Float64 === "number";

        if (!hasCoords) return null;

        return (
          <Marker
            key={mat.id}
            position={[mat.location_lat.Float64, mat.location_lng.Float64]}
            icon={defaultIcon}
          >
            <Popup>
              <strong>{mat.name?.Valid ? mat.name.String : "Unnamed Material"}</strong>
              <br />
              ID: {mat.id}
              <br />
              Type: {mat.type?.Valid ? mat.type.String : "Unknown"}
              <br />
              Qty: {mat.quantity} {mat.unit}
            </Popup>
          </Marker>
        );
      })}


    </MapContainer>
  );
}

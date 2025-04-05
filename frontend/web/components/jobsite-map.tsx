"use client";

import L, { LatLngBoundsExpression } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, Polygon, Rectangle } from "react-leaflet";
import useSWR from 'swr'
import { JobSite, User } from '@/user-api-types';
import "leaflet/dist/leaflet.css";
import { Token } from '@/user-api-types';
import { getToken } from "@/components/identity-provider";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Anchor point of the icon (where the tip is placed)
  popupAnchor: [1, -34], // Position of the popup relative to the icon
});

const jobSiteFetcher = async (url: string): Promise<JobSite[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

const userFetcher = async (url: string): Promise<User[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

async function getProfileArgs(url: string, arg: string) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: arg
  }).then(res => res.json() as Promise<Token>)
}

const token = getToken()
console.log("Token: ")
console.log(token)

const bounds: LatLngBoundsExpression = [
  [32.5260072, -92.6440465],
  [32.5266895, -92.6427248]
]

export default function JobsiteMapClient() {

  const { data: sites } = useSWR<JobSite[]>("/api/sites/all", jobSiteFetcher)
  const { data: users } = useSWR<User[]>("/api/user/all", userFetcher)

  if (!token) { return (<p className='flex items-center justify-center w-screen h-screen'>Invalid Token</p>) }

  const { data: tokenData, error: error2 } = useSWR(['/api/user/decrypt', token], ([url, token]) => getProfileArgs(url, token))

  if (error2) { return (<p className='flex items-center justify-center w-screen h-screen'>{error2.message}</p>) }

  const userID = tokenData?.id

  if (!sites || !users || !userID) {
    return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>)
  }

  if (sites && users && userID) {
    const user = users[userID - 1]
    if (!user.jobsite_id) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }
    const userJobsite = user.jobsite_id.Int64
    const site = sites[userJobsite - 1]

    if (!site) { return (<p className='flex items-center justify-center w-screen h-screen'>No Jobsite Found</p>) }

    const siteName = site.name

    return (
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={[site.location_lat.Float64, site.location_lng.Float64]}
        zoom={15}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[site.location_lat.Valid ? site.location_lat.Float64 : 0.0, site.location_lng.Valid ? site.location_lng.Float64 : 0.0]} icon={defaultIcon}>
          <Popup>
            {siteName}
          </Popup>
        </Marker>
        <Rectangle pathOptions={{ color: "purple" }} bounds={bounds} />
      </MapContainer>
    );
  }
}

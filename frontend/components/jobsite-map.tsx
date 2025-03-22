"use client";

import L, { LatLngBoundsExpression } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, Polygon, Rectangle  } from "react-leaflet";
import useSWR from 'swr'
import { JobSite } from '@/user-api-types';
import Loading from '@/components/loading';
import "leaflet/dist/leaflet.css";
import Link from "next/link";

const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Anchor point of the icon (where the tip is placed)
    popupAnchor: [1, -34], // Position of the popup relative to the icon
});

const jobSiteFetcher = async (url:string): Promise<JobSite[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

const userFetcher = async (url:string): Promise<JobSite[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

const bounds : LatLngBoundsExpression = [
  [32.5260072, -92.6440465],
  [32.5266895, -92.6427248]
]

export default function JobsiteMapClient() {

  const { data: sites } = useSWR<JobSite[]>("/api/sites/all", jobSiteFetcher)
  //if (isLoading) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  //if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }
  if (!sites){
    return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>)
  }
  if (sites){
    console.log(sites)
    const site = sites[0]
    console.log(site)
    const siteName = site.name
    console.log(siteName)

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
            <Link href="https://coes.latech.edu">The IESB</Link>
          </Popup>
        </Marker>
        <Rectangle pathOptions={{color: "purple"}} bounds={bounds}/>      
      </MapContainer>
    );
  }
}

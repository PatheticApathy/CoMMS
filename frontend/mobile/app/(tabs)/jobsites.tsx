import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import useSWR, { Fetcher } from 'swr';
import { GetUserRow, JobSite } from '@/user-api-types';
import { IdentityContext } from '@/components/securestore';
import { Material } from '@/material-api-types';
import { getHeaders } from '@/constants/header-options';

// Fetchers
const fetchUser: Fetcher<GetUserRow[], string> = async (...args) =>
  fetch(...args, {
    headers: await getHeaders(),
  }).then((res) => res.json());

const jobSiteFetcher: Fetcher<JobSite, string> = async (...args) =>
  fetch(...args, {
    headers: await getHeaders(),
  }).then((res) => res.json());

const materialFetcher: Fetcher<Material[], string> = async (...args) =>
  fetch(...args, {
    headers: await getHeaders(),
  }).then((res) => res.json());

// Fetch Nominatim Zone
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

// Create a fixed bounding box as a fallback
function createFixedBoundingBox(lat: number, lon: number, meters: number) {
  const offset = meters / 111320; // ~degrees per meter
  return [
    { latitude: lat - offset, longitude: lon - offset },
    { latitude: lat - offset, longitude: lon + offset },
    { latitude: lat + offset, longitude: lon + offset },
    { latitude: lat + offset, longitude: lon - offset },
  ];
}

export default function Jobsites() {
  const identity = useContext(IdentityContext);

  const { data: currentUser, error: errorUser, mutate: mutateUser } = useSWR<GetUserRow[]>(
    identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${identity?.id}` : null,
    fetchUser
  );

  const { data: currentSite, error: errorSite, mutate: mutateSite } = useSWR<JobSite>(
    currentUser && currentUser[0].jobsite_id.Valid
      ? `${process.env.EXPO_PUBLIC_API_URL}/api/sites/search?id=${currentUser[0].jobsite_id.Int64}`
      : null,
    jobSiteFetcher
  );

  const { data: materials, error: errorMaterials, mutate: mutateMaterials } = useSWR<Material[]>(
    currentUser
      ? `${process.env.EXPO_PUBLIC_API_URL}/api/material/material/search?site=${currentUser[0].jobsite_id.Valid ? currentUser[0].jobsite_id.Int64 : undefined
      }`
      : null,
    materialFetcher
  );

  const [zonePolygon, setZonePolygon] = useState<any | null>(null);
  const [fallbackPolygon, setFallbackPolygon] = useState<any | null>(null);

  const lat = currentSite?.location_lat?.Float64;
  const lng = currentSite?.location_lng?.Float64;

  useEffect(() => {
    if (lat && lng) {
      fetchNominatimZone(lat, lng)
        .then((data) => {
          if (data.geojson && data.geojson.type === "Polygon") {
            setZonePolygon(data.geojson.coordinates[0].map(([lon, lat]: [number, number]) => ({
              latitude: lat,
              longitude: lon,
            })));
            setFallbackPolygon(null);
          } else if (data.boundingbox) {
            const [south, north, west, east] = data.boundingbox.map(parseFloat);
            setFallbackPolygon([
              { latitude: south, longitude: west },
              { latitude: south, longitude: east },
              { latitude: north, longitude: east },
              { latitude: north, longitude: west },
            ]);
            setZonePolygon(null);
          } else {
            setFallbackPolygon(createFixedBoundingBox(lat, lng, 100)); // 100m fallback
            setZonePolygon(null);
          }
        })
        .catch((err) => {
          console.error("Nominatim error:", err);
          setFallbackPolygon(createFixedBoundingBox(lat, lng, 100)); // 100m fallback
          setZonePolygon(null);
        });
    }
  }, [lat, lng]);

  // Reload the page every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      mutateUser();
      mutateSite();
      mutateMaterials();
    }, 30000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [mutateUser, mutateSite, mutateMaterials]);

  if (!identity) {
    return (
      <View style={styles.centered}>
        <Text>Invalid Token</Text>
      </View>
    );
  }

  if (errorUser || errorSite || errorMaterials) {
    return (
      <View style={styles.centered}>
        <Text>Error: {errorUser?.message || errorSite?.message || errorMaterials?.message}</Text>
      </View>
    );
  }

  if (!currentUser || !currentSite || !lat || !lng || !materials) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.map}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Job Site Polygon */}
        {zonePolygon && (
          <Polygon
            coordinates={zonePolygon}
            strokeColor="purple"
            fillColor="rgba(128, 0, 128, 0.2)"
            strokeWidth={2}
          />
        )}

        {/* Fallback Polygon */}
        {fallbackPolygon && (
          <Polygon
            coordinates={fallbackPolygon}
            strokeColor="purple"
            fillColor="rgba(128, 0, 128, 0.2)"
            strokeWidth={2}
          />
        )}

        {/* Material Markers */}
        {materials.map((material) => {
          const hasCoords =
            material.location_lat?.Valid &&
            material.location_lng?.Valid &&
            typeof material.location_lat.Float64 === 'number' &&
            typeof material.location_lng.Float64 === 'number';

          if (!hasCoords) {
            console.warn(`Material ${material.id} is missing coordinates.`);
            return null;
          }

          return (
            <Marker
              key={material.id}
              coordinate={{
                latitude: material.location_lat.Float64,
                longitude: material.location_lng.Float64,
              }}
              title={material.name?.Valid ? material.name.String : 'Unnamed Material'}
              description={`Type: ${material.type?.Valid ? material.type.String : 'Unknown'
                }\nQty: ${material.quantity} ${material.unit}`}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

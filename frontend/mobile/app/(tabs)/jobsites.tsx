import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import useSWR, { Fetcher } from 'swr';
import { GetUserRow, JobSite } from '@/user-api-types';
import { getToken, IdentityContext } from '@/components/securestore';
import { Material } from '@/material-api-types';
import { getHeaders } from '@/constants/header-options';

const fetchUser: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders(),
}).then(res => res.json());

const jobSiteFetcher: Fetcher<JobSite, string> = async (...args) => fetch(...args, {
  headers: await getHeaders(),
}).then(res => res.json());

const materialFetcher: Fetcher<Material[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders(),
}).then(res => res.json());

export default function Jobsites() {
  const identity = useContext(IdentityContext);

  const { data: currentUser, error: errorUser } = useSWR<GetUserRow[]>(
    identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${identity?.id}` : null,
    fetchUser
  );

  const { data: currentSite, error: errorSite } = useSWR<JobSite>(
    currentUser && currentUser[0].jobsite_id.Valid
      ? `${process.env.EXPO_PUBLIC_API_URL}/api/sites/search?id=${currentUser[0].jobsite_id.Int64}`
      : null,
    jobSiteFetcher
  );

  const { data: materials, error: errorMaterials } = useSWR<Material[]>(
    currentUser
      ? `${process.env.EXPO_PUBLIC_API_URL}/api/material/material/search?site=${
          currentUser[0].jobsite_id.Valid ? currentUser[0].jobsite_id.Int64 : undefined
        }`
      : null,
    materialFetcher
  );

  const [zonePolygon, setZonePolygon] = useState<any | null>(null);

  const lat = currentSite?.location_lat?.Float64;
  const lng = currentSite?.location_lng?.Float64;

  useEffect(() => {
    if (lat && lng) {
      // Simulate fetching a polygon or bounding box for the job site
      setZonePolygon([
        { latitude: lat - 0.001, longitude: lng - 0.001 },
        { latitude: lat - 0.001, longitude: lng + 0.001 },
        { latitude: lat + 0.001, longitude: lng + 0.001 },
        { latitude: lat + 0.001, longitude: lng - 0.001 },
      ]);
    }
  }, [lat, lng]);

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

  // Check if the platform is iOS
  if (Platform.OS !== 'ios') {
    return (
      <View style={styles.centered}>
        <Text>Maps are only available on iOS</Text>
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

        {/* Material Markers */}
        {materials.map((material) => {
          const hasCoords =
            material.location_lat?.Valid &&
            material.location_lng?.Valid &&
            typeof material.location_lat.Float64 === 'number' &&
            typeof material.location_lng.Float64 === 'number';

          if (!hasCoords) return null;

          return (
            <Marker
              key={material.id}
              coordinate={{
                latitude: material.location_lat.Float64,
                longitude: material.location_lng.Float64,
              }}
              title={material.name?.Valid ? material.name.String : 'Unnamed Material'}
              description={`Type: ${
                material.type?.Valid ? material.type.String : 'Unknown'
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

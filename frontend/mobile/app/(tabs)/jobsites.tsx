import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import useSWR from 'swr';
import { GetUserRow, JobSite } from '@/user-api-types';
import { getToken, IdentityContext } from '@/components/securestore';
import { Material } from '@/material-api-types';
import { Headers } from '@/constants/header-options';

const fetchUser = async (url: string): Promise<GetUserRow[]> => {
  try {
    const res = await fetch(url, {
      headers: Headers,
    });
    if (!res.ok) {
      console.error(`fetchUser failed: ${res.status} ${res.statusText}`);
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error('fetchUser error:', error);
    throw error;
  }
};

const jobSiteFetcher = async (url: string): Promise<JobSite> => {
  const res = await fetch(url, {
    headers: Headers,
  });
  if (!res.ok) throw new Error('Failed to fetch job sites');
  return res.json();
};

const materialFetcher = async (url: string): Promise<Material[]> => {
  const res = await fetch(url, {
    headers: Headers,
  });
  if (!res.ok) throw new Error('Failed to fetch materials');
  return res.json();
};

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
    jobSiteFetcher,
  );

  const { data: materials, error: errorMaterials } = useSWR<Material[]>(
    currentUser
      ? `${process.env.EXPO_PUBLIC_API_URL}/api/material/material/search?site=${currentUser[0].jobsite_id.Valid
        ? currentUser[0].jobsite_id.Int64
        : undefined
      }`
      : null,
    materialFetcher,
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


  return (
    <View style={styles.map}>
      <MapView style={styles.map}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

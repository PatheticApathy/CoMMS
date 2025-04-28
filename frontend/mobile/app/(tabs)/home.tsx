import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import useSWR, { Fetcher } from 'swr';
import { IdentityContext } from '@/components/securestore';
import { MaterialWithLogs } from '@/material-api-types';
import Dashboard from '@/components/home';
import { useContext } from 'react';
import { getHeaders } from '@/constants/header-options';
import { GetUserRow, JobSite } from '@/user-api-types';


const fetchUser: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders()
}).then(res => res.json())
const fetchJobsite: Fetcher<JobSite, string> = async (...args) => fetch(...args, {
  headers: await getHeaders()
}).then(res => res.json())
const fetchJobsites: Fetcher<JobSite[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders()
}).then(res => res.json())
const fetchMaterials: Fetcher<MaterialWithLogs[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders()
}).then(res => res.json())

export default function HomePage() {
  const identity = useContext(IdentityContext);

  const { data: user } = useSWR(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${identity.id}` : null, fetchUser);
  const { data: jobsite } = useSWR(user && user[0] ? `${process.env.EXPO_PUBLIC_API_URL}/api/sites/search?id=${user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : undefined}` : null, fetchJobsite);
  const { data: jobsites } = useSWR(user && user[0] ? `${process.env.EXPO_PUBLIC_API_URL}/api/sites/company?id=${user[0].company_id.Valid ? user[0].company_id.Int64 : undefined}` : null, fetchJobsites);
  const { data: materials } = useSWR(user && user[0] ? `${process.env.EXPO_PUBLIC_API_URL}/api/material/material/created` : null, fetchMaterials);

  if (!identity || !user || !jobsite || !jobsites || !materials) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Dashboard jobsite={jobsite} jobsites={jobsites} materials={materials} />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
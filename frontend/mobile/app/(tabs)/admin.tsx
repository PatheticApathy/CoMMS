import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import useSWR, { Fetcher } from 'swr';
import { IdentityContext } from '@/components/securestore';
import { getHeaders } from '@/constants/header-options';
import { GetUserRow } from '@/user-api-types';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AdminTable from '@/components/admin-table';

const fetchUser: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders()
}).then(res => res.json())

export default function AdminPage() {
  const identity = useContext(IdentityContext);

  const { data: user } = useSWR(
    identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${identity.id}` : null,
    fetchUser
  );

  if (!identity) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Invalid Token</ThemedText>
      </ThemedView>
    );
  }

  if (!user || !user[0]?.role.Valid || user[0]?.role.String !== 'admin') {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Not an Admin</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Admin
      </ThemedText>
        <AdminTable />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
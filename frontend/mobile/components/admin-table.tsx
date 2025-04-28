import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import useSWR, { Fetcher } from 'swr';
import { IdentityContext } from '@/components/securestore';
import { GetUserRow, UserJoin } from '@/user-api-types';
import { getHeaders } from '@/constants/header-options';

const fetcher: Fetcher<UserJoin[], string> = async (...args) => fetch(...args, {
    headers: await getHeaders()
  }).then(res => res.json())
  const fetchUser: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, {
    headers: await getHeaders()
  }).then(res => res.json())

export default function AdminTable() {
  const identity = useContext(IdentityContext);

  const { data: user , isLoading} = useSWR(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${identity.id}` : null, fetchUser,)


  const { data: subordinates, error: error } = useSWR<UserJoin[]>(
    user ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/subordinates?user=${user[0].id}&company=${user[0]?.company_id.Int64}&site=${user[0]?.jobsite_id.Int64}` : null, 
    fetcher
);


  if (!identity) {
    return (
      <View style={styles.centered}>
        <Text>Invalid Token</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (!subordinates || subordinates.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No users found.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: UserJoin }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>Username: {item.username}</Text>
      <Text style={styles.cardSubtitle}>Email: {item.email}</Text>
      <Text style={styles.cardSubtitle}>Phone: {item.phone}</Text>
      <Text style={styles.cardSubtitle}>
        Company: {item.company_name || 'N/A'}
      </Text>
      <Text style={styles.cardSubtitle}>
        Jobsite: {item.jobsite_name || 'N/A'}
      </Text>
      <Text style={styles.cardSubtitle}>
        Role: {item.role?.String || 'N/A'}
      </Text>
      <Button title="Actions" onPress={() => console.log('Actions for', item.username)} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={subordinates}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});
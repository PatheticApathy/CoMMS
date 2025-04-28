import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { JobSite } from '@/user-api-types';
import { MaterialWithLogs } from '@/material-api-types';
import { Link } from 'expo-router';


export default function Dashboard({
  jobsite,
  jobsites,
  materials,
}: {
  jobsite: JobSite | undefined;
  jobsites: JobSite[] | undefined;
  materials: MaterialWithLogs[] | undefined;
}) {
  const filteredJobsites = jobsites?.filter((site) => site.id !== jobsite?.id);

  const getMostRecentMaterial = (jobsiteId: number | undefined) => {
    if (!materials || !jobsiteId) return null;
    const jobsiteMaterials = materials.filter((material) => material.job_site === jobsiteId);
    return jobsiteMaterials.sort(
        (a, b) => new Date(b.timestamp.Time).getTime() - new Date(a.timestamp.Time).getTime()).reverse()[0];
  };

  const mainJobsiteMaterial = getMostRecentMaterial(jobsite?.id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.sectionTitle}>Your Job Site</Text>
    <Link href="/(tabs)/jobsites" asChild>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>{jobsite?.name || 'No Jobsite Available'}</Text>
        <Text style={styles.cardSubtitle}>
          Address: {jobsite?.addr?.Valid ? jobsite.addr.String : 'No Address Available'}
        </Text>
        <Text style={styles.cardSubtitle}>
          {mainJobsiteMaterial
            ? `Most Recent Material: ${mainJobsiteMaterial.name.String} (${mainJobsiteMaterial.quantity})`
            : 'No Materials Available'}
        </Text>
      </TouchableOpacity>
    </Link>

      <Text style={styles.sectionTitle}>Other Jobsites</Text>
      {filteredJobsites && filteredJobsites.length > 0 ? (
        filteredJobsites.map((site) => {
          const recentMaterial = getMostRecentMaterial(site.id);
          return (
            <TouchableOpacity key={site.id} style={styles.card}>
              <Text style={styles.cardTitle}>{site.name || 'No Name Available'}</Text>
              <Text style={styles.cardSubtitle}>
                Address: {site.addr?.Valid ? site.addr.String : 'No Address Available'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {recentMaterial
                  ? `Most Recent Material: ${recentMaterial.name.String} (${recentMaterial.quantity})`
                  : 'No Materials Available'}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={styles.noJobsitesText}>No other jobsites available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
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
  },
  noJobsitesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
});
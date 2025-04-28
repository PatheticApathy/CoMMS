import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';

interface MaterialAddMapProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  jobSiteLat: number; // Job site latitude
  jobSiteLng: number; // Job site longitude
  onLocationSelect: (lat: number, lng: number) => void;
  onClose: () => void;
}

// Helper function to generate the job site polygon
const generateJobSitePolygon = (jobSiteLat: number, jobSiteLng: number): { latitude: number; longitude: number }[] => {
  return [
    { latitude: jobSiteLat - 0.001, longitude: jobSiteLng - 0.001 },
    { latitude: jobSiteLat - 0.001, longitude: jobSiteLng + 0.001 },
    { latitude: jobSiteLat + 0.001, longitude: jobSiteLng + 0.001 },
    { latitude: jobSiteLat + 0.001, longitude: jobSiteLng - 0.001 },
  ];
};

const MaterialAddMap: React.FC<MaterialAddMapProps> = ({
  initialRegion,
  jobSiteLat,
  jobSiteLng,
  onLocationSelect,
  onClose,
}) => {
  const [markerLocation, setMarkerLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [jobSitePolygon, setJobSitePolygon] = useState<{ latitude: number; longitude: number }[]>([]);

  // Generate the job site polygon dynamically
  useEffect(() => {
    setJobSitePolygon(generateJobSitePolygon(jobSiteLat, jobSiteLng));
  }, [jobSiteLat, jobSiteLng]);

  // Handle map press to place or update the marker
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerLocation({ latitude, longitude }); // Set the marker's location
  };

  // Confirm the selected location
  const handleConfirmLocation = () => {
    if (markerLocation) {
      onLocationSelect(markerLocation.latitude, markerLocation.longitude); // Pass the marker's location
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress} // Place or update the marker on map press
      >
        {/* Job Site Polygon */}
        <Polygon
          coordinates={jobSitePolygon}
          strokeColor="purple"
          fillColor="rgba(128, 0, 128, 0.2)"
          strokeWidth={2}
        />

        {/* Marker for the selected location */}
        {markerLocation && (
          <Marker
            coordinate={markerLocation} // Use the marker's location
            title="Selected Location"
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Confirm Location" onPress={handleConfirmLocation} disabled={!markerLocation} />
        <Button title="Cancel" onPress={onClose} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default MaterialAddMap;
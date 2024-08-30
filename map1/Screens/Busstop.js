import React, { useState, useEffect, useRef } from "react";
import { Text, View, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Button } from "react-native-paper";
import axios from "axios";

const HospitalFinder = () => {
  const [area, setArea] = useState('');
  const [nearestHospitals, setNearestHospitals] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleFetchHospitals = () => {
    Keyboard.dismiss();
    if (area) {
      geocodeAreaName(area);
    } else if (currentLocation) {
      fetchNearbyHospitals(currentLocation.latitude, currentLocation.longitude);
    }
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setCurrentLocation({ latitude, longitude });
    } catch (error) {
      console.error("Error fetching current location:", error);
    }
  };

  const geocodeAreaName = async (areaName) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(areaName)}&key=AIzaSyDouSDXuZs-C61VHt6eJiIgP4ndfv41pDU`
      );
      if (response.data && response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        fetchNearbyHospitals(location.lat, location.lng);
      } else {
        console.error('No results found for the specified area.');
      }
    } catch (error) {
      console.error('Error geocoding area name:', error);
    }
  };

  const fetchNearbyHospitals = async (lat, lng) => {
    try {
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=hospital&keyword=skin cancer hospital&key=AIzaSyDouSDXuZs-C61VHt6eJiIgP4ndfv41pDU`;

      const response = await axios.get(url);

      if (response.data && response.data.results && response.data.results.length > 0) {
        setNearestHospitals(response.data.results.slice(0, 100)); // Limiting to first 5 hospitals
        mapRef.current.animateToRegion({
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        console.error('No hospitals found nearby');
      }
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1}}>
        <Text style={{fontSize: 18, marginBottom:0,textAlign: 'center',}}>Find Nearby Skin Cancer Hospitals</Text>
        <TextInput
          placeholder="Enter Area Name"
          value={area}
          onChangeText={setArea}
          style={{ margin: 10, padding: 10, borderWidth: 1 }}
        />
        <Button mode="contained" onPress={handleFetchHospitals}  >
          Fetch Nearby Hospitals
        </Button>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: parseFloat(11.386429157302963) || 0,
            longitude: parseFloat (77.76795282943844) || 0,
            latitudeDelta: 4.7,
            longitudeDelta: 4.7,
          }}
        >
          {/* {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Current Location"
              description="You are here"
            />
          )} */}
          {nearestHospitals.map((hospital, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: hospital.geometry.location.lat,
                longitude: hospital.geometry.location.lng,
              }}
              title={hospital.name}
            />
          ))}
        </MapView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HospitalFinder;

import React, { useState, useEffect } from 'react';
import MapView, {  PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Animated ,ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
const { height } = Dimensions.get("window");;
import { db } from '../config';
import { ref, onValue } from 'firebase/database';
import MapViewDirections from 'react-native-maps-directions';
import SlidingUpPanel from "rn-sliding-up-panel";
import { styles } from './MapStyles'; 
import { MapTypeSelection } from './MapTypeSelection'; 
import { getDirections } from './directionsService';
import VerticalStepIndicator from './VerticalStepIndicator'; // Adjust the import path accordingly
import { Marker } from 'react-native-maps';
import { Image } from 'react-native';

import a from '../Screens/image/busstop.png';
const StopMarker = ({ coordinate, title, index }) => (
  <Marker
    coordinate={coordinate}
    title={title}
  >
    <Image source={a} style={{ width: 37, height: 30 }} />
    </Marker>
);
export default function Mappage() {
  const [mapType, setMapType] = useState('standard');
  const [markerLocations, setMarkerLocations] = useState([]);
  const [selectedGPS, setSelectedGPS] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [stopDistances, setStopDistances] = useState([]);
  const [totalStops, setTotalStops] = useState(1);
  const _draggedValue = new Animated.Value(180);
  const [showSlidingWindow, setShowSlidingWindow] = useState(false);
  const [stopCoordinates, setStopCoordinates] = useState([])
  const [selectedLatitude, setSelectedLatitude] = useState();
  const [selectedLongitude, setSelectedLongitude] = useState();
  const[dist,setdistance]=useState();
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const[stopNames,setStopNames]=useState();

  useEffect(() => {
    const starCountRef = ref(db, 'main/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMarkerLocations(data);
      }
    });
  }, []);

  useEffect(() => {
    // Update total stops whenever stopDistances changes
    setTotalStops(stopDistances.length+1);
  }, [stopDistances]);

  const changeMapType = (type) => {
    setMapType(type);
  };
  const handleGPSMarkerPress = async (gpsKey) => {
    if (selectedGPS === gpsKey) {
      setSelectedGPS(null);
      setShowRoute(false);
      setShowSlidingWindow(false);
      setStopDistances([]);
      setCurrentStopIndex(0);
       // Get the selected GPS marker data
      const selectedGPSData = markerLocations[gpsKey];
      const latitude = parseFloat(selectedGPSData.latitude);
      const longitude = parseFloat(selectedGPSData.longitude);  
      
      // Update the latitude and longitude state variables with the current GPS marker values
      setSelectedLatitude(latitude);
      setSelectedLongitude(longitude);
      
      // // Log the selected latitude and longitude values
      // console.log('Selected Latitude:', latitude);
      // console.log('Selected Longitude:', longitude);


    } else {
      setSelectedGPS(gpsKey);
      setShowSlidingWindow(true);
      setShowRoute(true);
      await calculateDistances(gpsKey, markerLocations);       // Pass markerLocations as an argument
      setCurrentStopIndex(0);
      // Get the selected GPS marker data
      const selectedGPSData = markerLocations[gpsKey];
      const latitude = parseFloat(selectedGPSData.latitude);
      const longitude = parseFloat(selectedGPSData.longitude);  
      
      // Update the latitude and longitude state variables with the current GPS marker values
      setSelectedLatitude(latitude);
      setSelectedLongitude(longitude);
    }
  };
  const calculateDistances = async (gpsKey) => {
    
    const selectedGPSData = markerLocations[gpsKey];
    const waypoints = Object.entries(selectedGPSData.Destination).map(([stopName, stopCoordinates]) => ({
      latitude: parseFloat(stopCoordinates.lat),
      longitude: parseFloat(stopCoordinates.lon),
        name: stopName,
    }));

    const distances = [];
    const dist=[];
    const stopCoordinates = [];
    const stopNames = [];
    let cumulativeDistance = 0; // Array to store latitude and longitude pairs
    distances.push({
      stopIndex: 0,
      name: "Source",
      distance: "0 km",
      duration: "0 minutes"
    });
    dist.push({
      stopIndex: 0,
      name: "Source",
      distance: "0.00",
      duration: "0 minutes"
      
    });
    for (let i = 0; i < waypoints.length; i++) {
      const currentStop = waypoints[i];
      stopNames.push(currentStop.name);
  }

    for (let i = 0; i < waypoints.length - 1; i++) {
        const start = waypoints[i];
        const end = waypoints[i + 1];
        const directions = await getDirections(start, end, []);
if (directions) {
      cumulativeDistance += directions.distance; // Add the current distance to the cumulative distance
      distances.push({
        stopIndex: i + 1,
        name: `Stop ${i + 1}`,
        distance: cumulativeDistance.toFixed(2), // Store the cumulative distance
        duration: formatDuration(directions.duration),
      });
            if (directions) 
              dist.push({
                stopIndex: i + 1,
                name: end.name,
                distance: cumulativeDistance.toFixed(2),
                duration: formatDuration(directions.duration),
              });
              

            // Store latitude and longitude values of each stop as an object
            stopCoordinates.push({
                latitude: start.latitude,
                longitude: start.longitude
            });

            stopCoordinates.push({
                latitude: end.latitude,
                longitude: end.longitude
            });
        }
    }

    // Remove duplicate coordinates if needed
    const uniqueStopCoordinates = stopCoordinates.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.latitude === value.latitude && t.longitude === value.longitude
        ))
    );
    // console.log('stopNames:', stopNames);
    // console.log('stopCoordinates:', uniqueStopCoordinates);
    // console.log('distances:', dist);
    setdistance(dist);
    setStopNames(stopNames);

    setStopDistances(distances);
    setStopCoordinates(uniqueStopCoordinates);

};


  const formatDuration = (duration) => {
    const hours = Math.floor(duration);
    const minutes = Math.floor((duration % 1) * 60);

    if (hours > 0 && minutes > 0) {
      return `${hours} hour ${minutes} minutes`;
    } else if (hours > 0) {
      return `${hours} hour`;
    } else {
      return `${minutes} minutes`;
    }
  };
const BottomSheet = ({ visible, onClose,selectedLatitude, selectedLongitude,stopsvalues,distances,names }) => {
  const backgoundOpacity = _draggedValue.interpolate({
    inputRange: [height - 48, height],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const iconTranslateY = _draggedValue.interpolate({
    inputRange: [height - 56, height, height + 180 - 64],
    outputRange: [0, 56, 180 - 32],
    extrapolate: 'clamp',
  });

  const textTranslateY = _draggedValue.interpolate({
    inputRange: [height + 180 - 64, height + 180],
    outputRange: [0, 8],
    extrapolate: 'clamp',
  });

  const textTranslateX = _draggedValue.interpolate({
    inputRange: [height + 180 - 64, height + 180],
    outputRange: [0, -112],
    extrapolate: 'clamp',
  });

  const textScale = _draggedValue.interpolate({
    inputRange: [height + 180 - 64, height + 180],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  return (
    visible && (
      <SlidingUpPanel
      ref={(c) => (this._panel = c)}
      draggableRange={{ top: height / 1.05, bottom: 180 }}
      animatedValue={_draggedValue}
      snappingPoints={[height / 1.5]}
      height={height}
      friction={0.5}
      visible={visible}
      onBottomReached={onClose}
    >
        <View style={styles.panel}>
          <Animated.View
            style={[
              styles.iconBg,
              {
                opacity: backgoundOpacity,
                transform: [{ translateY: iconTranslateY }],
              },
            ]}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.panelHeader}>
            <Animated.View
              style={{
                transform: [
                  { translateY: textTranslateY },
                  { translateX: textTranslateX },
                  { scale: textScale },
                ],
              }}
            >
              <Text style={styles.textHeader}>STOP DETAILS</Text>
            </Animated.View>
          </View>
          <ScrollView style={{ height: height - 180 }}
          >
            <VerticalStepIndicator
                      initialLatitude={selectedLatitude}
                      initialLongitude={selectedLongitude}
                      stops={stopsvalues}
                      distances={distances}
                      stopname={names}
            />
          </ScrollView>

          <View style={styles.container}>
          
          </View>
        </View>
      </SlidingUpPanel>
    )
  );
};
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 10.817777777777774,
          longitude: 77.01847931145132,
          latitudeDelta: 0.7,
          longitudeDelta: 0.7,
        }}
        mapType={mapType}
      >
        {Object.entries(markerLocations).map(([gpsKey, gpsData]) => (
           <Marker
           key={gpsKey}
           coordinate={{
             latitude: parseFloat(gpsData.latitude),
             longitude: parseFloat(gpsData.longitude),
           }}
           title={gpsKey}
           onPress={() => handleGPSMarkerPress(gpsKey)}
           
         >
           <Image source={require('../Screens/image/bus.png')} style={{ width: 37, height: 30 }} />
          </Marker>
        ))}
        {selectedGPS &&
          markerLocations[selectedGPS] &&
          showRoute &&
          Object.values(markerLocations[selectedGPS].Destination).map((stop, index) => (
            <StopMarker
              key={index}
              coordinate={{
                latitude: parseFloat(stop.lat),
                longitude: parseFloat(stop.lon),
              }}
              title={`Stop ${index + 1}`}
              
            >
              
              </StopMarker>
          ))}
        {selectedGPS && markerLocations[selectedGPS] && showRoute && (
          <MapViewDirections
            origin={{
              latitude: parseFloat(markerLocations[selectedGPS].Destination.stop1.lat),
              longitude: parseFloat(markerLocations[selectedGPS].Destination.stop1.lon),
            }}
            waypoints={Object.values(markerLocations[selectedGPS].Destination).map(stop => ({
              latitude: parseFloat(stop.lat),
              longitude: parseFloat(stop.lon),
            }))}
            destination={{
              latitude: parseFloat(Object.values(markerLocations[selectedGPS].Destination)[Object.values(markerLocations[selectedGPS].Destination).length - 1].lat),
              longitude: parseFloat(Object.values(markerLocations[selectedGPS].Destination)[Object.values(markerLocations[selectedGPS].Destination).length - 1].lon),
            }}
            apikey={'AIzaSyDouSDXuZs-C61VHt6eJiIgP4ndfv41pDU'}
            strokeWidth={4}
            strokeColor="blue"
            mode={"DRIVING"}
            precision={'high'}
            resetOnChange={false}
            optimizeWaypoints={true}
          />
        )}

      </MapView>
      {stopDistances && stopDistances.length > 0 && selectedGPS && showSlidingWindow && (
      <BottomSheet
      visible={showSlidingWindow}
      onClose={() => setShowSlidingWindow(false)}
      selectedLatitude={selectedLatitude}
       selectedLongitude={selectedLongitude}
       stopsvalues={stopCoordinates}
       distances={dist}
       names={stopNames}
      />
      )}
      <View>
        <MapTypeSelection mapType={mapType} changeMapType={changeMapType} style={styles.mapTypeSelection} />
      </View>
    </View>
  );
}


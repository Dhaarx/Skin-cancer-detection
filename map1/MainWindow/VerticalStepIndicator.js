import React, { useState, useEffect, useRef } from 'react';
import StepIndicator from 'react-native-step-indicator';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const VerticalStepIndicator = ({ initialLatitude, initialLongitude, stops, distances, stopname }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepIndicatorOpen, setIsStepIndicatorOpen] = useState(true);
  const [latitude, setLatitude] = useState(initialLatitude);
  const [longitude, setLongitude] = useState(initialLongitude);
  const visitedStopsRef = useRef(new Set());

  const handleGpsMarkerMove = () => {
    let minDistance = Infinity;
    let closestStopIndex = currentStep;

    stops.forEach((stop, index) => {
      if (!visitedStopsRef.current.has(index)) {
        const lat1 = latitude;
        const lon1 = longitude;
        const lat2 = stop.latitude;
        const lon2 = stop.longitude;
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        if (distance < minDistance) {
          minDistance = distance;
          closestStopIndex = index;
        }
      }
    });

    if (closestStopIndex !== currentStep) {
      visitedStopsRef.current.add(currentStep);
      setCurrentStep(closestStopIndex);
    }
  };

  useEffect(() => {
    handleGpsMarkerMove();
  }, [latitude, longitude, stops]);

  const toggleStepIndicator = () => {
    setIsStepIndicatorOpen(!isStepIndicatorOpen);
  };

  const modifiedLabels = distances.map((distance, index) => {
    const stopName = stopname[index];
    const distanceValue = parseInt(distance.distance);
    const durationValue = distance.duration;
    return `${stopName}\n${distanceValue} km`; // Display stop name followed by distance
  });

  return (
    <View style={{ flex: 1 }}>
      

      {isStepIndicatorOpen && (
        <View style={styles.stepContainer}>
          <StepIndicator
            customStyles={{
              stepIndicatorSize: 30,
              currentStepIndicatorSize: 30,
              separatorStrokeWidth: 2,
              currentStepStrokeWidth: 3,
              stepStrokeCurrentColor: 'green',
              stepStrokeWidth: 3,
              stepStrokeFinishedColor: 'green',
              stepStrokeUnFinishedColor: 'red',
              separatorFinishedColor: 'green',
              separatorUnFinishedColor: 'red',
              stepIndicatorFinishedColor: 'green',
              stepIndicatorUnFinishedColor: 'red',
              stepIndicatorCurrentColor: 'green',
              stepIndicatorLabelFontSize: 13,
              currentStepIndicatorLabelFontSize: 13,
              stepIndicatorLabelCurrentColor: 'green',
              stepIndicatorLabelFinishedColor: 'green',
              stepIndicatorLabelUnFinishedColor: 'red',
              labelColor: 'black',
              labelSize: 13,
              currentStepLabelColor: 'blue',
              height: 800, // Increase the height here
            }}
            currentPosition={currentStep}
            labels={modifiedLabels}
            stepCount={stops.length}
            direction="vertical"
          />
          <View >
            <Text style={styles.durationTitle}>Duration</Text>
            {distances.map((distance, index) => (
              <Text key={index} style={styles.durationText}>
                {distance.duration}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  stepIndicatorContainer: {
    marginRight: 100, // Add margin to the right to move the step indicator slightly right
  },
  durationContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationTitle: {
    fontWeight: 'bold',
    marginBottom: 55,
    textAlign: 'center',
  },
  durationText: {
    textAlign: 'center',
    borderWidth: 30,
    borderColor: 'white',
    marginBottom: 15,
  },
});

export default VerticalStepIndicator;

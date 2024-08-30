import { StyleSheet, Text, View, Button, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function MapScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64String = result.assets[0].base64;
      sendImageToBackend(base64String);
      setImage(result.assets[0].uri);
    } else {
      console.log("No image selected or no base64 value found.");
    }
  };

  const sendImageToBackend = async (base64String) => {
    try {
      const response = await axios.post('http://192.168.181.77:5000/predict', {
        image: base64String,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      setPrediction(response.data.predicted_class_name);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  if (hasPermission === false) {
    return <Text>No access to internal storage</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Pick image" onPress={pickImage} style={{ marginTop: 30 }} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {prediction && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>Predicted Class:</Text>
          <Text style={styles.predictionResult}>{prediction}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
  },
  predictionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  predictionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  predictionResult: {
    fontSize: 16,
    marginTop: 8,
  },
});

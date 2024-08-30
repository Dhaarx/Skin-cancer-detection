import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from "@react-native-material/core"; // Adjust the import path as needed
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Card } from 'react-native-paper';
import { auth } from '../config';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [showSidebar, setShowSidebar] = useState(false);

  const navigateToMapScreen = () => {
    navigation.navigate('Prediction');
  };

  const navigateToScreen3 = () => {
    navigation.navigate('Screen3');
  };

  const navigateToBusstand = () => {
    navigation.navigate('Chatbot');
  };

  const navigateToBusstop = () => {
    navigation.navigate('Hospitals');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <View style={styles.container}>
      
      
      <View style={styles.overlay}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={toggleSidebar}>
            <Avatar size={54} label={auth.currentUser?.email} />
          </TouchableOpacity>
        </View>
        <Text style={{ position: 'absolute', top: 130, color: 'white', fontSize: 25, fontWeight: 'bold' }}>
          Make your Journey Simple!
        </Text>

        <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()} style={styles.centered}>
          <Image style={styles.image} source={require("./image/6301.jpg")} />
        </Animated.View>
        <View style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 ,top:450}}>
          <Card 
            onPress={navigateToMapScreen} 
            style={styles.card1}
          >
            <Card.Title title="Predictor" titleStyle={styles.cardTitle}/>
            <Card.Content>
            <Text style={styles.cardicon}><MaterialIcons name="add-a-photo" size={35} color="white"  /></Text>
            </Card.Content>
          </Card>
          
        </View>
        <View style={{ position: 'absolute', top: 500, flexDirection: 'row', justifyContent: 'space-between',top:600 }}>
          
        <Card 
            onPress={navigateToBusstand} 
            style={styles.card}
          >
            <Card.Title title="Chatbot" titleStyle={styles.cardTitle1} />
            <Card.Content>
            <Text style={styles.cardicon1}><MaterialIcons name="question-answer" size={35} color="white" /></Text>
            </Card.Content>
          </Card>
          <Card 
            onPress={navigateToBusstop} 
            style={styles.card2}
          >
            <Card.Title title="Hospitals" titleStyle={styles.cardTitle2} />
            <Card.Content>
            <Text style={styles.cardicon2}><MaterialIcons name="local-hospital" size={35} color="white" /></Text>
            </Card.Content>
          </Card>
        </View>

        {showSidebar && (
          <View style={styles.sidebar}>
            <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
              <MaterialIcons name="close" size={25} color="black" />
            </TouchableOpacity>
            <View style={styles.sidebarParent}>
              <Text style={styles.sidebarText}>Profile</Text>
              <Text style={styles.sidebarText}>Settings</Text>
              <Text style={styles.sidebarText}>About</Text>
              <Text style={styles.sidebarText}>Email: {auth.currentUser?.email}</Text>
              <TouchableOpacity onPress={navigateToLogin} style={styles.button1}>
                <Text style={{ color: 'white' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    position: 'absolute',
    top: 60,
    left: 49,
  },
  title: {  
    fontSize: 18,
    color: 'black',
    marginBottom: 20,
    marginRight:20,
  },
  card1: {
    position: 'relative',
    // alignItems:'center',
    opacity: 1,
    height: 130,
    width: 230,
    shadowColor: 'black',
    shadowOffset: { width: 90, height: 90 },
    backgroundColor: '#02DBC4' ,
    marginLeft: 10,
  },
  card2: {
    position: 'relative',
    // alignItems:'center',
    opacity: 1,
    height: 130,
    width: 130,
    shadowColor: 'black',
    shadowOffset: { width: 90, height: 90 },
    backgroundColor: '#02DBC4',
  },
  card: {
    position: 'relative',
    // alignItems:'center',
    opacity: 1,
    height: 130,
    width: 130,
    shadowColor: 'black',
    shadowOffset: { width: 90, height: 90 },
    backgroundColor: '#02DBC4',
    marginRight: 10,
  },
  button1: {
    backgroundColor: 'black',
    margin: 10,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 10,
    width: 58,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
  avatarContainer: {
    position: 'absolute',
    top: 35,
    right: 5,
  },
  sidebar: {
    position: 'absolute',
    top: 33.8,
    bottom: 0,
    right: 0,
    width: 215,
    backgroundColor: 'white',
    zIndex: 1,
    padding: 20,
    borderTopLeftRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 25,
    right: 10,
  },
  sidebarParent: {
    marginTop: 50,
    justifyContent: 'flex-start',
  },
  sidebarText: {
    paddingBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    right:70,
    marginTop:40,
    height: 200,
    width: 400,
    opacity: 1,
  },
cardTitle: {
  marginLeft: 70, 
},
cardTitle1: {
  marginLeft: 23, 
},cardTitle2: {
  marginLeft: 17, 
},cardicon: {
  marginLeft: 77, 
},cardicon1: {
  marginLeft: 29, 
},cardicon2: {
  marginLeft: 29, 
},
});

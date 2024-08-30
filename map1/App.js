// App.js
import React from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import MapScreen from './Screens/MapScreen';
import Screen3 from './Screens/Screen3';
import Splash from './Screens/splash';
import Login from './Screens/login';
import Signup from './Screens/signup';
import Busstand from './Screens/Busstand';
import Busstop from './Screens/Busstop';
import BusTimings from './Screens/BusTimings';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" >
        <Stack.Screen name="SplashScreen" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Prediction"
          component={MapScreen}
          options={{ headerShown: true }} // Show header for MapScreen
        />
        <Stack.Screen name="Screen3" component={Screen3} options={{ headerShown: true }} />
        <Stack.Screen
          name="Chatbot"
          component={Busstand}
          options={{ headerShown: true }} // Show header for MapScreen
        />
        <Stack.Screen
          name="Hospitals"
          component={Busstop}
          options={{ headerShown: true }} // Show header for MapScreen
        />
        <Stack.Screen
          name="BusTimings"
          component={BusTimings}
          options={{ headerShown: true }} // Show header for MapScreen
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

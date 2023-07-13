import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import UserStack from './UserStack';
import AuthStack from './AuthStack';
import {useAuthentication} from '../utils/hooks/useAuthentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/loggedOutUser/Splash';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    intiial();
  }, []);
  const intiial = async () => {
    await getItem();
    setIsReady(true);
  };
  const getItem = async () => {
    const email = await AsyncStorage.getItem('EMAIL');
    console.log(email);
    if (email !== null) {
      setIsAuth(!isAuth);
    }
  };
  return (
    <NavigationContainer>
      
      {isReady && (
        <Stack.Navigator
          initialRouteName={isAuth ? 'UserStack' : 'AuthStack'}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="UserStack" component={UserStack} />
          <Stack.Screen name="AuthStack" component={AuthStack} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigation;

const styles = StyleSheet.create({});

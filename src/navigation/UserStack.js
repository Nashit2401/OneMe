import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/loggedInUser/Home';
import ContactUs from '../screens/loggedInUser/ContactUs';
import UploadDoc from '../screens/loggedInUser/labwork/UploadDoc';
import {button_color} from '../utils/colors/colors';
import AddTheDoc from '../screens/loggedInUser/labwork/AddTheDoc';

const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          title: 'Contact Us',
          headerStyle: {backgroundColor: button_color},
          headerTitleStyle: {color: 'white'},
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="UploadDoc"
        component={UploadDoc}
        options={{
          title: 'Lab Work',
          headerStyle: {backgroundColor: button_color},
          headerTitleStyle: {color: 'white'},
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="AddDoc"
        component={AddTheDoc}
        options={{
          title: 'Lab Work',
          headerStyle: {backgroundColor: button_color},
          headerTitleStyle: {color: 'white'},
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
};

export default UserStack;

const styles = StyleSheet.create({});

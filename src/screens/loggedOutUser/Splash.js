import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {button_color, text_color} from '../../utils/colors/colors';
import {useNavigation} from '@react-navigation/native';
import {
  teal100,
  white,
} from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle={'light-content'} />
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.logo, {color: button_color}]}>O</Text>
        <Text style={[styles.logo, {color: text_color}]}>neMe.</Text>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    fontSize: 30,
    color: 'white',
    fontWeight: '700',
  },
});

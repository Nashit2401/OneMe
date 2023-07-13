import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {IconButton} from 'react-native-paper';
import {button_color} from '../utils/colors/colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const HomeTile = ({title, icon, nav}) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => {
        // console.log(nav);
        navigation.navigate(nav);

        console.log(`PRESSED ${title}`);
      }}>
      <IconButton icon={icon} size={100} iconColor={button_color} />
      <View style={{alignItems: 'center'}}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default HomeTile;

const styles = StyleSheet.create({
  tile: {
    // width: 160,
    // height: 160,
    width: responsiveWidth(50),
    height: responsiveHeight(20),
    border: 0.5,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  title: {
    color: 'black',
    fontSize: responsiveFontSize(1),
    // fontSize: 16,
  },
});

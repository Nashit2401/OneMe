import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {bg_color, button_color, text_color} from '../../utils/colors/colors';
import HomeTile from '../../components/HomeTile';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const data = [
  {
    id: 1,
    title: 'Profile',
    nav: 'Profile',
    icon: 'account',
  },
  {
    id: 2,
    title: 'Manage health record',
    nav: 'ManageRecord',
    icon: 'folder-open',
  },
  {
    id: 3,
    title: 'Share your health record',
    nav: 'ShareRecord',
    icon: 'folder-swap',
  },
  {
    id: 4,
    title: 'Upload document',
    nav: 'UploadDoc',
    icon: 'file-upload',
  },
  {
    id: 5,
    title: 'Insuarance cards',
    nav: 'InsuranceCard',
    icon: 'card-account-details',
  },
  {
    id: 6,
    title: 'Contact Us',
    nav: 'ContactUs',
    icon: 'email-fast',
  },
];

const Home = () => {
  const signOut = async () => {
    await AsyncStorage.clear();
    navigation.navigate('AuthStack');
    // auth()
    //   .signOut()
    //   .then(() => {
    //     console.log('User Signed Out');
    //     navigation.navigate('Login');
    //   });
  };
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <Text style={styles.user}>Welcome</Text>
        <IconButton
          icon={'exit-to-app'}
          size={20}
          onPress={() => {
            signOut();
          }}
        />
      </View>
      <View style={styles.tiles}>
        <FlatList
          data={data}
          numColumns={2}
          renderItem={({item}) => {
            return (
              <HomeTile title={item.title} icon={item.icon} nav={item.nav} />
            );
          }}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bg_color,
    color: 'black',
  },
  topCard: {
    width: Dimensions.get('screen').width,
    height: 120,
    backgroundColor: 'white',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  user: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  tiles: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

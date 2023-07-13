import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Text, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  O_COLOR,
  bg_color,
  button_color,
  text_color,
} from '../../utils/colors/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {useNavigation} from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const signIn = async () => {
    let userData;
    try {
      const snapshot = await firestore()
        .collection('Users')
        .where('email', '==', email)
        .get();

      if (!snapshot.empty) {
        userData = snapshot.docs[0].data();
        if (userData.password === password) {
          goToNextScreen(userData);
        } else {
          console.log('Email or password incorrect');
        }
      }
    } catch (error) {
      console.log('Error:', error); // Handle the error here
    }
  };

  const goToNextScreen = async data => {
    try {
      await AsyncStorage.setItem('NAME', data.name);
      await AsyncStorage.setItem('EMAIL', data.email);
      await AsyncStorage.setItem('USERID', data.userId);
      navigation.navigate('UserStack');
    } catch (error) {
      console.log('Error:', error); // Handle the error here
    }
  };
  // if (email === '' || password === '') {
  //   setError({error: 'email and password are mandatory'});
  //   return;
  // }
  // try {
  //   await auth()
  //     .signInWithEmailAndPassword(email, password)
  //     .then(userCredential => {
  //       const user = userCredential.user;
  //       console.log(userCredential);
  //       navigation.navigate('Home');
  //       console.log('user logged in');
  //       Alert.alert('logged in');
  //     });
  // } catch (error) {
  //   setError({error: error.message});
  //   console.log(error);
  //   console.log('failed');
  // }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar backgroundColor={'#F3F5F7'} barStyle={'dark-content'} />
      <View style={styles.logoposition}>
        <Text style={{color: button_color, fontSize: 16, fontWeight: '800'}}>
          O
        </Text>
        <Text style={styles.logo}>neMe.</Text>
      </View>
      <TextInput
        style={styles.textFields}
        activeOutlineColor={button_color}
        placeholder="Email"
        placeholderTextColor={'lightgray'}
        value={email}
        mode="outlined"
        outlineColor="white"
        onChangeText={txt => setEmail(txt)}
      />
      <TextInput
        style={styles.textFields}
        activeOutlineColor={button_color}
        placeholder="Password"
        placeholderTextColor={'lightgray'}
        mode="outlined"
        value={password}
        outlineColor="white"
        onChangeText={txt => setPassword(txt)}
        secureTextEntry={isPasswordSecure}
        right={
          <TextInput.Icon
            name={isPasswordSecure ? 'eye-off' : 'eye'}
            size={28}
            onPress={() => setIsPasswordSecure(!isPasswordSecure)}
          />
        }
      />
      <Button
        style={[styles.button]}
        mode="outlined"
        onPress={() => {
          signIn();
        }}>
        <Text style={styles.buttonText}>Log In</Text>
      </Button>

      <View>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.text}>Recover Password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomText}>
        <Text style={{color: '#B4B8B9', marginBottom: 5}}>
          Dont' Have an account?
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Sign Up');
          }}>
          <Text style={{color: button_color, fontWeight: '700'}}>
            Create account
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('screen').height - 60,
    color: 'black',
    alignItems: 'center',
    backgroundColor: bg_color,
  },
  logoposition: {
    marginTop: 100,
    marginBottom: 80,
    flexDirection: 'row',
  },
  logo: {
    color: text_color,
    fontSize: 16,
    fontWeight: '800',
  },
  textFields: {
    width: Dimensions.get('screen').width - 20,
    marginTop: 10,
    elevation: 5,
  },
  button: {
    marginTop: 20,
    width: Dimensions.get('screen').width - 20,
    backgroundColor: button_color,
    borderRadius: 0,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  text: {
    color: text_color,
    fontWeight: '700',
    marginTop: 20,
  },
  bottomText: {
    position: 'absolute',
    bottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

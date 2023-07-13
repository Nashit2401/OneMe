import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {
  TextInput,
  Text,
  Button,
  Switch,
  IconButton,
  Icon,
} from 'react-native-paper';
import {O_COLOR, button_color, text_color} from '../../utils/colors/colors';
import {useNavigation} from '@react-navigation/native';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import Loader from '../../components/Loader';

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [visible, setVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const registerUser = async () => {
    setVisible(true);
    const querySnapshot = await firestore()
      .collection('Users')
      .where('email', '==', email)
      .get();
    if (querySnapshot.empty) {
      const userId = uuid.v4();
      firestore().collection('Users').doc(userId).set({
        name: name,
        userId: userId,
        email: email,
        password: password,
      });
    } else {
      Alert.alert('email already exists');
    }
    console.log(querySnapshot.docs);

    //   auth()
    //     .createUserWithEmailAndPassword(email, password)
    //     .then(async userCredential => {
    //       const user = userCredential.user;
    //       console.log('User account created & signed in');
    //       Alert.alert('user created');
    //       navigation.navigate('Home');
    //       // auth().currentUser.updateProfile(update);
    //       // console.log(userCredential);
    //     })
    //     .catch(error => {
    //       if (error.code === 'auth/email-already-in-use') {
    //         console.log('That email address is already in use!');
    //         Alert.alert('email already in use');
    //       }

    //       if (error.code === 'auth/invalid-email') {
    //         console.log('That email address is invalid!');
    //         navigation.goBack();
    //         Alert.alert('invalid email');
    //       }

    //       console.error(error);
    //     });
  };

  // const checkEmail = async () => {
  //   await firestore()
  //     .collection('Users')
  //     .where('email', '==', email)
  //     .get()
  //     .then(docunmentSnapshot => {
  //       console.log('user exists:', docunmentSnapshot.exists);
  //       if (!docunmentSnapshot) {
  //         console.log('no user with this email:');
  //       } else {
  //         console.log('user exists');
  //       }
  //     });
  // };

  const validate = () => {
    let valid = true;
    if (name === '') {
      valid = false;
    }
    if (email == '') {
      valid = false;
    }
    if (password == '') {
      valid = false;
    }
    if (confirmPassword == '' || confirmPassword !== password) {
      valid = false;
    }
    if (isSelected == false) {
      valid = false;
    }
    return valid;
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar backgroundColor={'#F3F5F7'} barStyle={'dark-content'} />
      <View
        style={{
          alignItems: 'center',
          // backgroundColor: 'blue',
          height: Dimensions.get('screen').height,
        }}>
        <View style={styles.back}>
          <IconButton
            icon="chevron-left"
            size={40}
            iconColor={button_color}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={{justifyContent: 'center', alignContent: 'center'}}>
            <Text style={[styles.signUptext]}>Sign Up</Text>
          </View>
        </View>
        <View style={styles.logoposition}>
          <Text style={{color: button_color, fontSize: 16, fontWeight: '800'}}>
            O
          </Text>
          <Text style={styles.logo}>neMe.</Text>
        </View>
        <TextInput
          style={styles.textFields}
          activeOutlineColor={button_color}
          placeholder="Name"
          placeholderTextColor={'lightgray'}
          value={name}
          mode="outlined"
          outlineColor="white"
          onChangeText={txt => setName(txt)}
        />
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
              name={isConfirmPasswordSecure ? 'eye-off' : 'eye'}
              color={'black'}
              size={28}
              onPress={() => setIsPasswordSecure(!isPasswordSecure)}
            />
          }
        />
        <TextInput
          style={styles.textFields}
          activeOutlineColor={button_color}
          placeholder="Confirm Password"
          placeholderTextColor={'lightgray'}
          mode="outlined"
          value={confirmPassword}
          outlineColor="white"
          onChangeText={txt => setConfirmPassword(txt)}
          secureTextEntry={isConfirmPasswordSecure}
          right={
            <TextInput.Icon
              name={isConfirmPasswordSecure ? 'eye-off' : 'eye'}
              size={28}
              onPress={() =>
                setIsConfirmPasswordSecure(!isConfirmPasswordSecure)
              }
            />
          }
        />
        <View style={styles.policy}>
          <Switch
            value={isSelected}
            color={isSelected ? button_color : 'default'}
            onChange={() => {
              setIsSelected(!isSelected);
            }}
          />
          <Text>I agree to the</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.text}>
              Terms and Service and Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomText}>
          <TouchableOpacity
            onPress={() => {
              registerUser();
              // if (checkEmail()) {
              //   console.log('cant create ');
              // } else {
              //   registerUser();
              // }
            }}>
            <Text
              style={{color: button_color, fontWeight: '600', fontSize: 20}}>
              Sign Up.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <Loader visible={visible} /> */}
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('screen').height,
    color: 'black',
    backgroundColor: '#F3F5F7',
    //
  },
  logoposition: {
    marginTop: 100,
    marginBottom: 80,
    flexDirection: 'row',
  },
  signUptext: {
    color: text_color,
    marginLeft: 80,
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: '700',
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
  policy: {flexDirection: 'row', marginTop: 20, padding: 5},
  button: {
    marginTop: 20,
    width: Dimensions.get('screen').width - 30,
    backgroundColor: button_color,
    borderRadius: 0,
    borderColor: 'white',
    alignContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  text: {
    color: button_color,
    fontWeight: '500',
  },
  bottomText: {
    // position: 'absolute',
    // bottom: 25,
    marginTop: 100,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    left: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: -20,
    // backgroundColor: 'red',
  },
  backText: {
    color: button_color,
    fontSize: 16,

    fontWeight: '400',
  },
});

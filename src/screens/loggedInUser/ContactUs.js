import {StyleSheet, View, Dimensions, Alert} from 'react-native';
import React, {useState} from 'react';
import {bg_color, button_color, text_color} from '../../utils/colors/colors';
import {TextInput, Text, Button, IconButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const ContactUs = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    const email = await AsyncStorage.getItem('EMAIL');
    const userId = await AsyncStorage.getItem('USERID');

    const messageId = uuid.v4();

    const querySnapshot = await firestore()
      .collection('Users')
      .where('email', '==', email)
      .get();
    if (!querySnapshot.empty) {
      firestore()
        .collection('messages')
        .doc(messageId)
        .set({
          userId: userId,
          messageBy: email,
          subject: subject,
          message: message,
        })
        .then(res => {
          console.log('message created');
          Alert.alert('message is sent');
        })
        .catch(error => {
          console.log('error is:', error);
        });
    } else {
      console.log('could not find email');
      Alert.alert('could not find email');
    }
    console.log(`subject is ${subject}`, `message is ${message}`);
  };
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.text}>Lets Get in Touch</Text>
      </View>
      <View
        style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
        <TextInput
          style={styles.textFields}
          underlineColor={button_color}
          value={subject}
          activeUnderlineColor={button_color}
          label={'Subject'}
          mode="focused"
          outlineColor="white"
          onChangeText={txt => {
            setSubject(txt);
          }}
        />
        <TextInput
          style={styles.textFields}
          underlineColor={button_color}
          value={message}
          multiline={true}
          activeUnderlineColor={button_color}
          label={'Message'}
          mode="focused"
          outlineColor="white"
          onChangeText={txt => {
            setMessage(txt);
          }}
        />
      </View>
      <View
        style={{
          bottom: 10,
          right: 10,
          position: 'absolute',
        }}>
        <View style={styles.bottomcard}>
          <IconButton
            onPress={() => {
              sendMessage();
            }}
            icon={'send-outline'}
            size={30}
            iconColor={'white'}
          />
        </View>
      </View>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    margin: 20,
    color: text_color,
    fontWeight: '600',
  },
  textFields: {
    width: Dimensions.get('screen').width - 20,
    marginTop: 10,
    elevation: 5,
    backgroundColor: bg_color,
  },
  bottomcard: {
    width: 60,
    border: 0.5,
    height: 60,
    backgroundColor: button_color,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
});

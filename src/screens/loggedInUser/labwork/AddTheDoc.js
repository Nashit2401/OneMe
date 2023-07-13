import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput, Text, Button} from 'react-native-paper';
import {bg_color, button_color} from '../../../utils/colors/colors';
import {enGB, registerTranslation} from 'react-native-paper-dates';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import {PermissionsAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {DatePickerModal} from 'react-native-paper-dates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';

registerTranslation('en-Gb', enGB);

const AddTheDoc = () => {
  const route = useRoute();

  const navigation = useNavigation();
  const [imageName, setImageName] = useState(
    route.params.type == 'edit' ? route.params.data._data.imageName : '',
  );
  const [date, setDate] = useState(
    route.params.type == 'edit' ? route.params.data._data.date : undefined,
  );

  const [open, setOpen] = useState(false);
  const [imageData, setImageData] = useState({
    assets: [
      {
        fileName: '',
        uri:
          route.params.type == 'edit'
            ? route.params.data._data.documentImage
            : '',
      },
    ],
  });

  const onDismissSignal = () => {
    setOpen(false);
  };

  const onConfirmSignal = params => {
    setOpen(false);
    setDate(params.date);
  };
  const openDatePicker = () => {
    setOpen(true);
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        openGallery();
        // openCamera();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openGallery = async () => {
    const res = await launchImageLibrary({mediaType: 'photo'});
    if (!res.didCancel) {
      setImageData(res);
    }
  };
  const openCamera = async () => {
    const res = await launchCamera({mediaType: 'photo'});
    if (!res.didCancel) {
      setImageData(res);
    }
  };

  const saveDocument = async () => {
    const email = await AsyncStorage.getItem('EMAIL');
    const userId = await AsyncStorage.getItem('USERID');

    const uploadedDocumentId = uuid.v4();
    let url = '';
    if (imageData.assets[0].fileName !== '') {
      const reference = storage().ref(imageData.assets[0].fileName);
      const pathToFile = imageData.assets[0].uri;
      await reference.putFile(pathToFile);
      url = await storage().ref(imageData.assets[0].fileName).getDownloadURL();
    }

    if (route.params.type == 'edit') {
      const querySnapshot = await firestore()
        .collection('Users')
        .where('email', '==', email)
        .get();

      if (!querySnapshot.empty) {
        firestore()
          .collection('uploaded documents')
          .doc(route.params.data._data.uploadedDocumentId)
          .update({
            imageName: imageName,
            imageDate: date,
            uploadedDocumentId: route.params.data._data.uploadedDocumentId,
            documentImage:
              imageData.assets[0].fileName == ''
                ? route.params.data._data.documentImage
                : url,
          })
          .then(res => {
            Alert.alert('document edited');
            navigation.goBack();
          })
          .catch(error => {
            console.log('Error updating document:', error);
            // Handle the error here (e.g., show an error message)
          });
      } else {
        console.log('email not found');
        Alert.alert('email not found');
      }
    } else {
      const querySnapshot = await firestore()
        .collection('Users')
        .where('email', '==', email)
        .get();
      if (!querySnapshot.empty) {
        firestore()
          .collection('uploaded documents')
          .doc(uploadedDocumentId)
          .set({
            imageName: imageName,
            imageDate: date,
            addedBy: email,
            userId: userId,
            uploadedDocumentId: uploadedDocumentId,
            documentImage: url,
          })
          .then(res => {
            Alert.alert('document saved');
            navigation.goBack();
          })
          .catch(error => {
            console.log('error is:', error);
          });
      } else {
        console.log('email not found');
        Alert.alert('email not found');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
        <TextInput
          style={styles.textFields}
          underlineColor={button_color}
          value={imageName}
          activeUnderlineColor={button_color}
          label={'Name'}
          mode="focused"
          outlineColor="white"
          onChangeText={txt => {
            setImageName(txt);
          }}
        />
        {/* <TextInput
          style={styles.textFields}
          underlineColor={button_color}
          value={date}
          multiline={true}
          activeUnderlineColor={button_color}
          label={'Date'}
          mode="focused"
          outlineColor="white"
          onKeyPress={() => {
            setOpen(true);
          }}
        /> */}
        {/* <Button
          style={styles.button}
          title="Open"
          onPress={() => setOpen(true)}
        />
        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        /> */}
        <TextInput
          style={styles.textFields}
          underlineColor="transparent"
          value={date ? date.toDateString() : ''}
          label={'Date'}
          mode="outlined"
          onFocus={openDatePicker}
        />
        <DatePickerModal
          locale="en-Gb"
          mode="single"
          visible={open}
          onDismiss={onDismissSignal}
          date={date}
          onConfirm={onConfirmSignal}
        />
        <View style={styles.bannerView}>
          {/* if there is no image in the uri, it will show the camera icon else it will show the image that is in the uri */}
          {imageData.assets[0].uri == '' ? (
            <TouchableOpacity
              onPress={() => {
                requestCameraPermission();
              }}>
              <Image
                source={require('../../../utils/images/camera.png')}
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.banner}
              onPress={() => {
                requestCameraPermission();
              }}>
              <Image
                source={{uri: imageData.assets[0].uri}}
                style={styles.banner}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
        }}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => {
            saveDocument();
          }}>
          Save
        </Button>
      </View>
    </View>
  );
};

export default AddTheDoc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  bannerView: {
    width: '90%',
    height: 200,
    borderWidth: 0.5,
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 'auto',
    heightL: 'auto ',
    marginTop: 10,
    backgroundColor: button_color,
  },
  textFields: {
    width: Dimensions.get('screen').width - 20,
    marginTop: 10,
    elevation: 5,
    backgroundColor: bg_color,
  },
  cameraIcon: {
    width: 60,
    height: 60,
  },
  banner: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

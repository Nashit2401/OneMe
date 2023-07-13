import {FlatList, StyleSheet, View, Dimensions, Image} from 'react-native';
import React, {useState, useEffect} from 'react';

import {Text, IconButton} from 'react-native-paper';
import {bg_color, button_color} from '../../../utils/colors/colors';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const UploadDoc = () => {
  const [documentList, setDocumentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    getDocument();
  }, [isFocused]);

  const deleteDocument = item => {
    setIsLoading(true);
    firestore()
      .collection('uploaded documents')
      .doc(item._data.uploadedDocumentId)
      .delete()
      .then(() => {
        console.log('item deleted');

        getDocument();
      })
      .catch(error => {
        console.log('error deleting document:', error);
        setIsLoading(false);
      });
  };

  const getDocument = async () => {
    setIsLoading(true);
    const userId = await AsyncStorage.getItem('USERID');
    firestore()
      .collection('uploaded documents')
      .where('userId', '==', userId)
      .get()
      .then(snapshot => {
        // console.log(JSON.stringify(snapshot.docs[0].data()));
        if (Object.keys(snapshot.docs).length !== 0) {
          const data = snapshot.docs.map(doc => doc.data());
          setDocumentList(snapshot.docs);
          console.log('here1', typeof snapshot.docs);
        } else {
          setIsLoading(false);
          console.log('empty');
          setDocumentList('');
        }
      })
      .catch(error => {
        console.log('error is:', error);
      });
  };
  return (
    <View style={styles.container}>
      {documentList.length == 0 && !isLoading && (
        <View style={styles.defaultScreen}>
          <Text style={styles.heading1}> No Data Found</Text>
          <Text style={styles.heading2}> PLEASE UPLOAD A DOCUMENT</Text>
        </View>
      )}
      <FlatList
        data={documentList}
        renderItem={({item, index}) => {
          const imageDate = item._data.imageDate.toDate();
          const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          };
          const formattedDate = imageDate.toLocaleString(undefined, options);
          return (
            <View style={styles.documentItem}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item._data.documentImage}}
                  style={styles.documentImage}
                />
                <View style={{marginLeft: 10}}>
                  <Text style={styles.name}>{item._data.imageName}</Text>
                  <Text style={styles.desc}>{formattedDate}</Text>
                </View>
              </View>
              <View>
                <IconButton
                  icon={'image-edit'}
                  size={20}
                  iconColor={button_color}
                  onPress={() => {
                    navigation.navigate('AddDoc', {
                      data: item,
                      type: 'edit',
                    });
                  }}
                />
                <IconButton
                  icon={'delete'}
                  iconColor="red"
                  size={20}
                  onPress={() => {
                    deleteDocument(item);
                  }}
                />
              </View>
            </View>
          );
        }}
      />

      <View
        style={{
          bottom: 10,
          right: 10,
          position: 'absolute',
          // backgroundColor: 'red',
        }}>
        <View style={styles.bottomcard}>
          <IconButton
            onPress={() => {
              navigation.navigate('AddDoc', {type: 'new'});
            }}
            icon={'plus'}
            size={30}
            iconColor={'white'}
          />
        </View>
      </View>
    </View>
  );
};

export default UploadDoc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bg_color,
  },
  defaultScreen: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  heading1: {fontSize: 24, fontWeight: '700'},
  heading2: {fontSize: 22, fontWeight: '500'},
  documentItem: {
    width: Dimensions.get('window').width,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    marginTop: 10,
    paddingRight: 20,
    justifyContent: 'space-between',
  },
  documentImage: {width: 90, height: 90, borderRadius: 10},
  bottomcard: {
    width: 60,
    border: 0.5,
    height: 60,
    backgroundColor: button_color,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  desc: {fontSize: 15, fontWeight: '400', color: 'black'},
});

import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged, User} from '@react-native-firebase/auth';

const auth = getAuth();

export default function useAuthentication() {
  const [user, setUser] = useState();
  useEffect(() => {
    const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    });
    return unsubscribeFromAuthStateChanged;
  }, []);
  return {user};
}

import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthLoading extends React.Component {
  componentDidMount() {
    this.cek();
  }

  cek = async () => {
    const login = await AsyncStorage.getItem('isLoggedIn');
    this.props.navigation.navigate(login !== '1' ? 'Login' : 'Tab');
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
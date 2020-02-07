import React from 'react';
import {StyleSheet, View, Text, ScrollView, Alert} from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import AsyncStorage from '@react-native-community/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'deptech6.db', createFromLocation: 1});

const style = StyleSheet.create({
  judul2: {
    color: '#7E94B3',
    fontWeight: 'bold',
    fontSize: 20,
    margin: 5,
  },
  isi: {
    color: '#1D3962',
    fontSize: 20,
    margin: 5,
    flexDirection: 'row',
  },
  garis: {
    borderBottomColor: '#EAEFF7',
    borderBottomWidth: 1,
    marginBottom: 12,
  },
});

class Profil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: '',
      depan: '',
      belakang: '',
      email: '',
    };
  }

  async componentDidMount() {
    const dt = await AsyncStorage.getItem('dt');
    this.setState({admin: JSON.parse(dt)});
  }

  render() {
    return (
      <>
        <Header title="Profil Saya" />
        <ScrollView style={{padding: 10}}>
          <Text style={style.judul2}>Nama Depan</Text>
          <Text style={style.isi}>{this.state.admin.depan}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>Nama Belakang</Text>
          <Text style={style.isi}>{this.state.admin.belakang}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>Email</Text>
          <Text style={style.isi}>{this.state.admin.email}</Text>
          <View style={style.garis} />
        </ScrollView>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Button
            title="Logout"
            color="tomato"
            icon="md-exit"
            onPress={this.logout.bind(this)}
          />
        </View>
      </>
    );
  }

  logout() {
    Alert.alert('Logout', 'Apakah anda yakin akan logout?', [
      {text: 'Tidak'},
      {
        text: 'Iya',
        onPress: () => {
          AsyncStorage.clear();
          this.props.navigation.navigate('Login');
        },
      },
    ]);
  }
}

export default Profil;

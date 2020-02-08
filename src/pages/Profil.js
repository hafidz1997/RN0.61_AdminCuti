import React from 'react';
import {StyleSheet, View, Text, ScrollView, Alert, Image} from 'react-native';
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
  foto: {
    width: 200,
    height: 200,
    margin: 20,
    borderRadius: 100,
    alignSelf: 'center',
  },
});

class Profil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: '',
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
          <Image source={{uri: this.state.admin.foto}} style={style.foto} />
          <Text style={style.judul2}>Nama Depan</Text>
          <Text style={style.isi}>{this.state.admin.depan}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>Nama Belakang</Text>
          <Text style={style.isi}>{this.state.admin.belakang}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>Email</Text>
          <Text style={style.isi}>{this.state.admin.email}</Text>
          <View style={style.garis} />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Button
              title="Edit Profil"
              color="#779DCA"
              icon="md-create"
              // alignSelf="center"
              onPress={() =>
                this.props.navigation.navigate('FormAdmin', {
                  id: this.state.admin.id,
                })
              }
            />
            <Button
              title="Logout"
              color="tomato"
              icon="md-exit"
              onPress={this.logout.bind(this)}
            />
          </View>
        </ScrollView>
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

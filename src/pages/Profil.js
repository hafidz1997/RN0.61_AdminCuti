import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import AsyncStorage from '@react-native-community/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
import {ToastError} from '../helpers/function';

let db = openDatabase({name: 'deptech6.db', createFromLocation: 1});

class Profil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: '',
      refreshing: false,
    };

    this.getprofil();
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.getprofil();
    });
  }

  async getprofil() {
    const dt = await AsyncStorage.getItem('dt');
    let dt2 = JSON.parse(dt);
    let id = dt2.id;
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM admin where id = ?',
        [id],
        (tx, results) => {
          let len = results.rows.length;
          if (len > 0) {
            this.setState({
              admin: results.rows.item(0),
            });
          } else {
            ToastError();
          }
        },
      );
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getprofil().then(() => {
      this.setState({refreshing: false});
    });
  };

  render() {
    let foto;
    // console.warn(this.state.admin.id);
    if (this.state.admin.foto) {
      foto = <Image source={{uri: this.state.admin.foto}} style={style.foto} />;
    } else {
      foto = (
        <Image source={require('../assets/profil.png')} style={style.foto} />
      );
    }
    return (
      <>
        <Header title="Profil Saya" />
        <ScrollView
          style={style.padding}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          {foto}
          <Text style={style.judul2}>Nama Depan</Text>
          <Text style={style.isi}>{this.state.admin.depan}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>Nama Belakang</Text>
          <Text style={style.isi}>{this.state.admin.belakang}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>Email</Text>
          <Text style={style.isi}>{this.state.admin.email}</Text>
          <View style={style.garis} />
          <View style={style.row}>
            <Button
              title="Edit Profil"
              color="#779DCA"
              icon="md-create"
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

const style = StyleSheet.create({
  row: {flexDirection: 'row', justifyContent: 'center'},
  padding: {padding: 10},
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

export default Profil;

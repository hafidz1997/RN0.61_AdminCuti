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
import {ToastError} from '../helpers/function';
import db from '../helpers/variable';
import firebase from 'react-native-firebase';

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
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log('has permission');
        } else {
          console.log('no permission');
          this.NotiPermission();
        }
      });
    this.getToken();
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('fcm token asyncstorage:', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('fcm token firebase:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async NotiPermission() {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        console.warn('authorized');
      })
      .catch(error => {
        console.warn('permission rejected');
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

  async notif() {
    // console.warn('notification');
    const key = 'AIzaSyBSKD1SayfB8FRTtz07WM6soWEREfD__fg';
    const msg = {
      registration_ids: [
        'f4qPCSOjYMw:APA91bE2-5zQDez5gfOd3BJox-Y4l6BuUiNtUBcR3CgU8fLnsZTIljf-ZJxZ3P5Fb9an76xDhfpSSkXwt2-GUqoqRICcT7aHK5RhFEAymqRjgZb2RODwuI-P4Pq1R7XtXpkG4kSbVD6E',
      ],
      // to:
      //   'f4qPCSOjYMw:APA91bE2-5zQDez5gfOd3BJox-Y4l6BuUiNtUBcR3CgU8fLnsZTIljf-ZJxZ3P5Fb9an76xDhfpSSkXwt2-GUqoqRICcT7aHK5RhFEAymqRjgZb2RODwuI-P4Pq1R7XtXpkG4kSbVD6E',
      notification: {
        title: 'Hello World!',
        body: 'My first notification!',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
    };
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + key,
    });

    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(msg),
    });
    // response = await response.json();
    console.log(JSON.stringify(msg));
  }

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
              title="Push Notif"
              color="gold"
              icon="md-notifications"
              onPress={() => this.notif()}
            />
          </View>
          <View style={{marginBottom: 20}}>
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
  row: {flexDirection: 'row', justifyContent: 'center', margin: 20},
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

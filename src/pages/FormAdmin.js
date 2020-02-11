import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  ToastAndroid,
  Image,
} from 'react-native';
import HeaderDetail from '../components/HeaderDetail';
import Button from '../components/Button';
import {openDatabase} from 'react-native-sqlite-storage';
import {ActionSheet, Root} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';

let db = openDatabase({name: 'deptech6.db', createFromLocation: 1});

class FormAdmin extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      admin: [],
      depan: '',
      belakang: '',
      email: '',
      password: '',
      judul: '',
      checked: false,
      pass: true,
      foto: null,
    };
    let id = this.props.navigation.getParam('id', 0);
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM admin where id = ?', [id], (tx, results) => {
        let len = results.rows.length;
        console.log('len', len);
        if (len > 0) {
          this.setState({
            admin: results.rows.item(0),
            depan: results.rows.item(0).depan,
            belakang: results.rows.item(0).belakang,
            email: results.rows.item(0).email,
            foto: results.rows.item(0).foto,
          });
        } else {
          this.setState({
            judul: 'Tambah Admin',
          });
        }
      });
    });
  }

  async componentDidMount() {
    this._isMounted = true;
    let id = this.props.navigation.getParam('id', 0);
    const dt = await AsyncStorage.getItem('dt');
    const data = JSON.parse(dt);
    if (data.id === id) {
      this.setState({judul: 'Edit Profil'});
    } else {
      this.setState({judul: 'Update Admin'});
    }
  }

  showpass() {
    this.setState(prevState => ({
      pass: !prevState.pass,
      checked: !prevState.checked,
    }));
  }

  fromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      this.setState({
        foto: image.path,
      });
    });
  };

  fromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      this.setState({
        foto: image.path,
      });
    });
  };

  upload = () => {
    const BUTTONS = ['Ambil Foto', 'Pilih dari Gallery', 'Batal'];
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: 2,
        title: 'Pilih Foto',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this.fromCamera();
            break;
          case 1:
            this.fromGallery();
            break;
          default:
            break;
        }
      },
    );
  };

  tambah = () => {
    let that = this;
    const {depan, belakang, email, password, foto} = this.state;
    if (depan) {
      if (belakang) {
        if (email) {
          if (password) {
            if (foto) {
              db.transaction(tx => {
                tx.executeSql(
                  'INSERT INTO admin (depan, belakang, email, password, foto) VALUES (?,?,?,?,?)',
                  [depan, belakang, email, password, foto],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      ToastAndroid.showWithGravity(
                        'Admin berhasil ditambahkan',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                      );
                      that.props.navigation.pop();
                    } else {
                      ToastAndroid.showWithGravity(
                        'Gagal',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                      );
                    }
                  },
                );
              });
            } else {
              ToastAndroid.showWithGravity(
                'Foto belum diupload',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
              );
            }
          } else {
            ToastAndroid.showWithGravity(
              'Password belum diisi',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );
          }
        } else {
          ToastAndroid.showWithGravity(
            'Email belum diisi',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      } else {
        ToastAndroid.showWithGravity(
          'Nama Belakang belum diisi',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    } else {
      ToastAndroid.showWithGravity(
        'Nama Depan belum diisi',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  };

  update = () => {
    let that = this;
    let id = this.props.navigation.getParam('id', 0);
    const {depan, belakang, email, foto} = this.state;
    if (depan) {
      if (belakang) {
        if (email) {
          if (foto) {
            db.transaction(tx => {
              tx.executeSql(
                'UPDATE admin set depan=?, belakang=?, email=?, foto=? where id=?',
                [depan, belakang, email, foto, id],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    ToastAndroid.showWithGravity(
                      'Admin berhasil di update',
                      ToastAndroid.LONG,
                      ToastAndroid.CENTER,
                    );
                    that.props.navigation.pop();
                  } else {
                    ToastAndroid.showWithGravity(
                      'Update gagal',
                      ToastAndroid.LONG,
                      ToastAndroid.CENTER,
                    );
                  }
                },
              );
            });
          } else {
            ToastAndroid.showWithGravity(
              'Foto belum diupload',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );
          }
        } else {
          ToastAndroid.showWithGravity(
            'Email belum diisi',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      } else {
        ToastAndroid.showWithGravity(
          'Nama Depan belum diisi',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    } else {
      ToastAndroid.showWithGravity(
        'Nama Belakang belum diisi',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  };

  render() {
    let {foto} = this.state;
    let tampilan;
    if (this.state.admin.length !== 0) {
      tampilan = (
        <Button
          title="Update"
          color="#779DCA"
          icon="md-create"
          alignSelf="center"
          onPress={this.update.bind(this)}
        />
      );
    } else {
      tampilan = (
        <>
          <Text style={style.label}>Password</Text>
          <TextInput
            secureTextEntry={this.state.pass}
            placeholder="Masukkan Password"
            style={style.input}
            onChangeText={password => this.setState({password})}
          />
          <View style={style.row}>
            <CheckBox
              style={style.marginLeft}
              value={this.state.checked}
              onChange={() => this.showpass()}
            />
            <Text>Show Password</Text>
          </View>
          <Button
            title="Simpan"
            color="#779DCA"
            icon="ios-create"
            alignSelf="center"
            onPress={this.tambah.bind(this)}
          />
        </>
      );
    }
    return (
      <Root>
        <HeaderDetail
          title={this.state.judul}
          onPress={() => this.props.navigation.pop()}
        />
        <View style={style.container}>
          <ScrollView>
            <Text style={style.judul}>{this.state.judul}</Text>
            <Text style={style.label}>Nama Depan</Text>
            <TextInput
              placeholder="Masukkan Nama Depan"
              style={style.input}
              value={this.state.depan}
              onChangeText={depan => this.setState({depan})}
            />
            <Text style={style.label}>Nama Belakang</Text>
            <TextInput
              placeholder="Masukkan Nama Belakang"
              style={style.input}
              value={this.state.belakang}
              onChangeText={belakang => this.setState({belakang})}
            />
            <Text style={style.label}>Foto Profil</Text>
            <Button
              title="Upload Foto"
              color="#779DCA"
              icon="ios-create"
              alignSelf="flex-start"
              onPress={this.upload}
            />
            {foto && <Image source={{uri: foto}} style={style.foto} />}
            <Text style={style.label}>Email</Text>
            <TextInput
              placeholder="Masukkan Email"
              style={style.input}
              value={this.state.email}
              onChangeText={email => this.setState({email})}
              keyboardType="email-address"
            />
            {tampilan}
          </ScrollView>
        </View>
      </Root>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  marginLeft: {marginLeft: 15},
  judul: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  input: {
    borderColor: 'grey',
    borderWidth: 1,
    margin: 20,
  },
  kosong: {
    fontSize: 20,
    color: 'grey',
    alignSelf: 'center',
    marginTop: '50%',
  },
  icon: {
    width: 25,
    justifyContent: 'center',
    alignContent: 'center',
    lineHeight: 50,
    height: 50,
    marginTop: 20,
  },
  foto: {width: 200, height: 200, margin: 20},
});

export default FormAdmin;

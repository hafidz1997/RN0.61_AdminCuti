import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  ToastAndroid,
} from 'react-native';
import Button from '../components/Button';

import {openDatabase} from 'react-native-sqlite-storage';
import HeaderDetail from '../components/HeaderDetail';
import {RadioButton} from 'react-native-paper';
let db = openDatabase({name: 'deptech6.db', createFromLocation: 1});

class TambahPegawai extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pegawai: [],
      depan: '',
      belakang: '',
      email: '',
      no: '',
      alamat: '',
      jk: '',
      judul: '',
    };
    let id = this.props.navigation.getParam('id', 0);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pegawai where id = ?',
        [id],
        (tx, results) => {
          let len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            this.setState({
              pegawai: results.rows.item(0),
              depan: results.rows.item(0).depan,
              belakang: results.rows.item(0).belakang,
              email: results.rows.item(0).email,
              no: results.rows.item(0).no,
              alamat: results.rows.item(0).alamat,
              jk: results.rows.item(0).jk,
              judul: 'Update Pegawai',
            });
          } else {
            this.setState({
              judul: 'Tambah Pegawai',
            });
          }
        },
      );
    });
  }

  tambah = () => {
    let that = this;
    const {depan, belakang, email, no, alamat, jk} = this.state;
    if (depan) {
      if (belakang) {
        if (email) {
          if (no) {
            if (alamat) {
              if (jk) {
                db.transaction(tx => {
                  tx.executeSql(
                    'INSERT INTO pegawai (depan, belakang, email, no, alamat, jk) VALUES (?,?,?,?,?,?)',
                    [depan, belakang, email, no, alamat, jk],
                    (tx, results) => {
                      if (results.rowsAffected > 0) {
                        ToastAndroid.showWithGravity(
                          'Pegawai berhasil ditambahkan',
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
                  'Jenis Kelamin belum diisi',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );
              }
            } else {
              ToastAndroid.showWithGravity(
                'Alamat belum diisi',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
              );
            }
          } else {
            ToastAndroid.showWithGravity(
              'Nomor HP belum diisi',
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
    const {depan, belakang, email, no, alamat, jk} = this.state;
    if (depan) {
      if (belakang) {
        if (email) {
          if (no) {
            if (alamat) {
              if (jk) {
                db.transaction(tx => {
                  tx.executeSql(
                    'UPDATE pegawai set depan=?, belakang=?, email=?,no=?,alamat=?,jk=? where id=?',
                    [depan, belakang, email, no, alamat, jk, id],
                    (tx, results) => {
                      if (results.rowsAffected > 0) {
                        ToastAndroid.showWithGravity(
                          'Pegawai berhasil di update',
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
                  'Jenis Kelamin belum diisi',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );
              }
            } else {
              ToastAndroid.showWithGravity(
                'Alamat belum diisi',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
              );
            }
          } else {
            ToastAndroid.showWithGravity(
              'No Hp belum diisi',
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
    let tampilan;
    // console.warn(this.state.pegawai.jk);
    if (this.state.pegawai.length !== 0) {
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
        <Button
          title="Simpan"
          color="#779DCA"
          icon="ios-create"
          alignSelf="center"
          onPress={this.tambah.bind(this)}
        />
      );
    }
    // let coba = this.state.jk - 1;
    // console.warn(coba);
    const {jk} = this.state;
    return (
      <>
        <HeaderDetail
          title={this.state.judul}
          onPress={() => this.props.navigation.pop()}
        />
        <View style={{flex: 1, backgroundColor: 'white'}}>
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
            <Text style={style.label}>Email</Text>
            <TextInput
              placeholder="Masukkan Email"
              style={style.input}
              value={this.state.email}
              onChangeText={email => this.setState({email})}
              keyboardType="email-address"
            />
            <Text style={style.label}>No HP</Text>
            <TextInput
              placeholder="Masukkan Nomor HP"
              style={style.input}
              value={this.state.no}
              onChangeText={no => this.setState({no})}
              keyboardType="phone-pad"
            />
            <Text style={style.label}>Alamat</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder="Masukkan Alamat"
              style={style.input}
              value={this.state.alamat}
              onChangeText={alamat => this.setState({alamat})}
            />
            <Text style={style.label}>Jenis Kelamin</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{position: 'relative', margin: 20}}>
                <RadioButton
                  status={jk === 1 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({jk: 1});
                  }}
                  color="#779DCA"
                />
                <Text
                  style={{
                    fontSize: 15,
                    position: 'absolute',
                    left: 40,
                    top: 5,
                  }}>
                  Pria
                </Text>
              </View>
              <View style={{position: 'relative', margin: 20}}>
                <RadioButton
                  status={jk === 2 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({jk: 2});
                  }}
                  color="#779DCA"
                />
                <Text
                  style={{
                    fontSize: 15,
                    position: 'absolute',
                    left: 40,
                    top: 5,
                    width: 100,
                  }}>
                  Wanita
                </Text>
              </View>
            </View>
            {tampilan}
          </ScrollView>
        </View>
      </>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  radio: {
    margin: 20,
  },
  kosong: {
    fontSize: 20,
    color: 'grey',
    alignSelf: 'center',
    marginTop: '50%',
  },
});

export default TambahPegawai;

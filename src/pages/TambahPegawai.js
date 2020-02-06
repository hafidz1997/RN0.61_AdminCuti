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
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {openDatabase} from 'react-native-sqlite-storage';
import HeaderDetail from '../components/HeaderDetail';
let db = openDatabase({name: 'deptech4.db', createFromLocation: 1});

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    // justifyContent: 'center',
    borderRadius: 8,
    shadowRadius: 10,
    width: '90%',
    height: 300,
    padding: 10,
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

let radio_props = [
  {label: 'Pria', value: 'Pria'},
  {label: 'Wanita', value: 'Wanita'},
];

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
    };
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM pegawai', [], (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          pegawai: temp,
        });
      });
    });
  }

  tambah = () => {
    let that = this;
    const {depan, belakang, email, no, alamat, jk} = this.state;
    // console.warn(alamat);
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
                        tx.executeSql(
                          'SELECT * FROM pegawai',
                          [],
                          (tx, results) => {
                            let temp = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                              temp.push(results.rows.item(i));
                            }
                            this.setState({
                              pegawai: temp,
                            });
                          },
                        );
                        ToastAndroid.showWithGravity(
                          'Pegawai berhasil ditambahkan',
                          ToastAndroid.LONG,
                          ToastAndroid.CENTER,
                        );
                        that.refs.Modal.close();
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

  render() {
    return (
      <>
        <HeaderDetail
          title="Tambah Pegawai"
          onPress={() => this.props.navigation.pop()}
        />
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
            <Text style={style.judul}>Tambah Pegawai</Text>
            <Text style={style.label}>Nama Depan</Text>
            <TextInput
              placeholder="Masukkan Nama Depan"
              style={style.input}
              onChangeText={depan => this.setState({depan})}
            />
            <Text style={style.label}>Nama Belakang</Text>
            <TextInput
              placeholder="Masukkan Nama Belakang"
              style={style.input}
              onChangeText={belakang => this.setState({belakang})}
            />
            <Text style={style.label}>Email</Text>
            <TextInput
              placeholder="Masukkan Email"
              style={style.input}
              onChangeText={email => this.setState({email})}
              keyboardType="email-address"
            />
            <Text style={style.label}>No HP</Text>
            <TextInput
              placeholder="Masukkan Nomor HP"
              style={style.input}
              onChangeText={no => this.setState({no})}
              keyboardType="phone-pad"
            />
            <Text style={style.label}>Alamat</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder="Masukkan Alamat"
              style={style.input}
              onChangeText={alamat => this.setState({alamat})}
            />
            <Text style={style.label}>Jenis Kelamin</Text>
            <RadioForm
              style={style.radio}
              radio_props={radio_props}
              initial={''}
              onPress={value => {
                this.setState({jk: value});
              }}
              labelHorizontal={true}
              selectedButtonColor={'#779DCA'}
              buttonColor={'#779DCA'}
              selectedLabelColor={'#779DCA'}
              labelColor={'#779DCA'}
              // formHorizontal={true}
              buttonSize={15}
              buttonStyle={{marginLeft: 10}}
            />
            <Button
              title="Simpan"
              color="#779DCA"
              icon="ios-create"
              onPress={this.tambah.bind(this)}
            />
          </ScrollView>
        </View>
      </>
    );
  }
}

export default TambahPegawai;

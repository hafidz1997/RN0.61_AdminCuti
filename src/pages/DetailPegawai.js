import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  ToastAndroid,
} from 'react-native';
import HeaderDetail from '../components/HeaderDetail';
import Button from '../components/Button';
import Modal from 'react-native-modalbox';
import {openDatabase} from 'react-native-sqlite-storage';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
let db = openDatabase({name: 'deptech5.db', createFromLocation: 1});

const style = StyleSheet.create({
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
  radio: {
    margin: 20,
  },
});

let radio_props = [
  {label: 'Pria', value: 'Pria'},
  {label: 'Wanita', value: 'Wanita'},
];

class DetailPegawai extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pegawai: '',
      depan: '',
      belakang: '',
      email: '',
      no: '',
      alamat: '',
      jk: '',
    };
    let id = this.props.navigation.getParam('id', 0);
    // console.warn(id);
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
            });
            this.setState({
              depan: results.rows.item(0).depan,
            });
            this.setState({
              belakang: results.rows.item(0).belakang,
            });
            this.setState({
              email: results.rows.item(0).email,
            });
            this.setState({
              no: results.rows.item(0).no,
            });
            this.setState({
              alamat: results.rows.item(0).alamat,
            });
            this.setState({
              jk: results.rows.item(0).jk,
            });
          } else {
            ToastAndroid.showWithGravity(
              'No user found',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );
            this.setState({
              pegawai: '',
            });
          }
        },
      );
    });
  }

  render() {
    return (
      <>
        <HeaderDetail
          title="Detail Pegawai"
          onPress={() => this.props.navigation.pop()}
        />
        <ScrollView style={{padding: 10}}>
          <Text style={style.judul2}>Nama Depan</Text>
          <Text style={style.isi}>{this.state.pegawai.depan}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>Nama Belakang</Text>
          <Text style={style.isi}>{this.state.pegawai.belakang}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>Email</Text>
          <Text style={style.isi}>{this.state.pegawai.email}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>No HP</Text>
          <Text style={style.isi}>{this.state.pegawai.no}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>Alamat</Text>
          <Text style={style.isi}>{this.state.pegawai.alamat}</Text>
          <View style={style.garis} />
          <Text style={style.judul2}>Jenis Kelamin</Text>
          <Text style={style.isi}>{this.state.pegawai.jk}</Text>
          <View style={style.garis} />
        </ScrollView>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Button
            title="Hapus"
            color="tomato"
            icon="ios-trash"
            onPress={this.hapus.bind(this)}
          />
          <Button
            title="Update"
            color="#779DCA"
            icon="md-create"
            onPress={this.openModal.bind(this)}
          />
        </View>
        <Modal
          ref={'Modal'}
          style={style.modalContainer}
          position="center"
          backdrop={true}
          swipeToClose={false}>
          <ScrollView>
            <Text style={style.judul}>Update Pegawai</Text>
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
              onChangeText={alamat => this.setState({alamat})}
              value={this.state.alamat}
            />
            <Text style={style.label}>Jenis Kelamin</Text>
            <RadioForm
              style={style.radio}
              radio_props={radio_props}
              initial={''}
              value={this.state.jk}
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
              title="Update"
              color="#779DCA"
              icon="md-create"
              onPress={this.update.bind(this)}
            />
          </ScrollView>
        </Modal>
      </>
    );
  }

  update = () => {
    let that = this;
    let id = this.props.navigation.getParam('id', 0);
    const {depan, belakang, email, no, alamat, jk} = this.state;
    // console.warn(depan);
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
                      // console.warn('Results',results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        tx.executeSql(
                          'SELECT * FROM pegawai where id = ?',
                          [id],
                          (tx, results) => {
                            let len = results.rows.length;
                            console.log('len', len);
                            if (len > 0) {
                              this.setState({
                                pegawai: results.rows.item(0),
                              });
                              this.setState({
                                depan: results.rows.item(0).depan,
                              });
                              this.setState({
                                belakang: results.rows.item(0).belakang,
                              });
                              this.setState({
                                email: results.rows.item(0).email,
                              });
                            } else {
                              ToastAndroid.showWithGravity(
                                'No user found',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER,
                              );
                              this.setState({
                                pegawai: '',
                              });
                            }
                          },
                        );
                        ToastAndroid.showWithGravity(
                          'Pegawai berhasil di update',
                          ToastAndroid.LONG,
                          ToastAndroid.CENTER,
                        );
                        that.refs.Modal.close();
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

  openModal() {
    this.refs.Modal.open();
  }

  hapus() {
    Alert.alert('Hapus pegawai', 'Apakah anda yakin akan menghapus pegawai?', [
      {text: 'Tidak'},
      {text: 'Iya', onPress: this.deletepegawai},
    ]);
  }

  deletepegawai = () => {
    let that = this;
    let id = this.props.navigation.getParam('id', 0);
    db.transaction(tx => {
      tx.executeSql('DELETE FROM pegawai where id=?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          ToastAndroid.showWithGravity(
            'Pegawai berhasil dihapus',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
          that.props.navigation.navigate('Pegawai');
        } else {
          ToastAndroid.showWithGravity(
            'Gagal',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      });
    });
  };
}

export default DetailPegawai;

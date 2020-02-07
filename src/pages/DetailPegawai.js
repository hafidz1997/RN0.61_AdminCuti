import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import HeaderDetail from '../components/HeaderDetail';
import Button from '../components/Button';
import {openDatabase} from 'react-native-sqlite-storage';

let db = openDatabase({name: 'deptech6.db', createFromLocation: 1});

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

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
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
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    let jk;
    if (this.state.pegawai.jk === 1) {
      jk = 'Pria';
    } else if (this.state.pegawai.jk === 2) {
      jk = 'Wanita';
    }
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
          <Text style={style.isi}>{jk}</Text>
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
            onPress={() =>
              this.props.navigation.navigate('TambahPegawai', {
                id: this.state.pegawai.id,
              })
            }
          />
        </View>
      </>
    );
  }
}

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
export default DetailPegawai;

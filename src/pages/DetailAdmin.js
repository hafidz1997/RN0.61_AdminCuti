import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  ToastAndroid,
  Image,
} from 'react-native';
import HeaderDetail from '../components/HeaderDetail';
import Button from '../components/Button';
import Modal from 'react-native-modalbox';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'deptech5.db', createFromLocation: 1});

class DetailAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: '',
      depan: '',
      belakang: '',
      email: '',
      foto: '',
    };
    let id = this.props.navigation.getParam('id', 0);
    // console.warn(id);
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
          ToastAndroid.showWithGravity(
            'No user found',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
          this.setState({
            admin: '',
          });
        }
      });
    });
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      let id = this.props.navigation.getParam('id', 0);
      // console.warn(id);
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM admin where id = ?',
          [id],
          (tx, results) => {
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
              ToastAndroid.showWithGravity(
                'No user found',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
              );
              this.setState({
                admin: '',
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

  hapus() {
    Alert.alert('Hapus Admin', 'Apakah anda yakin akan menghapus admin?', [
      {text: 'Tidak'},
      {text: 'Iya', onPress: this.deleteAdmin},
    ]);
  }

  deleteAdmin = () => {
    let that = this;
    let id = this.props.navigation.getParam('id', 0);
    db.transaction(tx => {
      tx.executeSql('DELETE FROM admin where id=?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          ToastAndroid.showWithGravity(
            'Admin berhasil dihapus',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
          that.props.navigation.navigate('Admin');
        } else {
          ToastAndroid.showWithGravity(
            'Hapus gagal',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      });
    });
  };

  render() {
    let {foto} = this.state.admin;
    return (
      <>
        <HeaderDetail
          title="Detail Admin"
          onPress={() => this.props.navigation.pop()}
        />
        <ScrollView style={{padding: 10}}>
          {foto && <Image source={{uri: foto}} style={style.foto} />}
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
              this.props.navigation.navigate('FormAdmin', {
                id: this.state.admin.id,
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
  foto: {
    width: 200,
    height: 200,
    margin: 20,
    borderRadius: 100,
    alignSelf: 'center',
  },
});

export default DetailAdmin;

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
let db = openDatabase({name: 'deptech4.db', createFromLocation: 1});

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
});

class DetailAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: '',
      depan: '',
      belakang: '',
      email: '',
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
            admin: '',
          });
        }
      });
    });
  }

  render() {
    return (
      <>
        <HeaderDetail
          title="Detail Admin"
          onPress={() => this.props.navigation.pop()}
        />
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
            <Text style={style.judul}>Update Admin</Text>
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
    const {depan, belakang, email} = this.state;
    // console.warn(depan);
    if (depan) {
      if (belakang) {
        if (email) {
          db.transaction(tx => {
            tx.executeSql(
              'UPDATE admin set depan=?, belakang=?, email=? where id=?',
              [depan, belakang, email, id],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  tx.executeSql(
                    'SELECT * FROM admin where id = ?',
                    [id],
                    (tx, results) => {
                      let len = results.rows.length;
                      console.log('len', len);
                      if (len > 0) {
                        this.setState({
                          admin: results.rows.item(0),
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
                          admin: '',
                        });
                      }
                    },
                  );
                  ToastAndroid.showWithGravity(
                    'Admin berhasil di update',
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
}

export default DetailAdmin;

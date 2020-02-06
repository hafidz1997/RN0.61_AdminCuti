import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  ToastAndroid,
} from 'react-native';
import HeaderDetail from '../components/HeaderDetail';
import AddButton from '../components/AddButton';
import List from '../components/List';
import Modal from 'react-native-modalbox';
import Button from '../components/Button';
import {openDatabase} from 'react-native-sqlite-storage';
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
  kosong: {
    fontSize: 20,
    color: 'grey',
    alignSelf: 'center',
    marginTop: '50%',
  },
});

class TambahAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: [],
      depan: '',
      belakang: '',
      email: '',
      password: '',
    };
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM admin', [], (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          admin: temp,
        });
      });
    });
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM admin', [], (tx, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            admin: temp,
          });
        });
      });
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    return (
      <>
        <HeaderDetail
          title="Tambah Admin"
          onPress={() => this.props.navigation.pop()}
        />
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
            <Text style={style.judul}>Tambah Admin</Text>
            <Text style={style.label}>Nama Depan</Text>
            <TextInput
              placeholder="Masukkan Nama Depan"
              style={style.input}
              // value={this.state.title}
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
            <Text style={style.label}>Password</Text>
            <TextInput
              secureTextEntry={true}
              placeholder="Masukkan Password"
              style={style.input}
              onChangeText={password => this.setState({password})}
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

  tambah = () => {
    let that = this;
    const {depan, belakang, email, password} = this.state;
    if (depan) {
      if (belakang) {
        if (email) {
          if (password) {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT INTO admin (depan, belakang, email, password) VALUES (?,?,?,?)',
                [depan, belakang, email, password],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    // tx.executeSql('SELECT * FROM admin', [], (tx, results) => {
                    //   let temp = [];
                    //   for (let i = 0; i < results.rows.length; ++i) {
                    //     temp.push(results.rows.item(i));
                    //   }
                    //   this.setState({
                    //     admin: temp,
                    //   });
                    // });
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
}

export default TambahAdmin;

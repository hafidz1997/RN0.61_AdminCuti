import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Header from '../components/Header';
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

class Admin extends React.Component {
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

  tambah = () => {
    let that = this;
    const {depan, belakang, email, password} = this.state;
    //alert(depan, belakang, email, password);
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
                    tx.executeSql('SELECT * FROM admin', [], (tx, results) => {
                      let temp = [];
                      for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                      }
                      this.setState({
                        admin: temp,
                      });
                    });
                    Alert.alert(
                      'Berhasil',
                      'Admin berhasil ditambahkan',
                      [
                        {
                          text: 'Ok',
                          onPress: () => that.refs.Modal.close(),
                        },
                      ],
                      {cancelable: false},
                    );
                  } else {
                    alert('Gagal');
                  }
                },
              );
            });
          } else {
            alert('Password belum diisi');
          }
        } else {
          alert('Email belum diisi');
        }
      } else {
        alert('Nama Belakang belum diisi');
      }
    } else {
      alert('Nama Depan belum diisi');
    }
  };

  render() {
    let tampilan;
    if (this.state.admin.length != 0) {
      tampilan = (
        <FlatList
          data={this.state.admin}
          renderItem={({item}) => (
            <List
              depan={item.depan}
              belakang={item.belakang}
              email={item.email}
              onPress={() =>
                this.props.navigation.navigate('DetailAdmin', {id: item.id})
              }
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      );
    } else {
      tampilan = <Text style={style.kosong}>No Data</Text>;
    }
    return (
      <>
        <Header title="List Admin" />
        <View style={{flex: 1}}>
          {tampilan}
          <AddButton onPress={this.openModal.bind(this)} />
          <Modal
            ref={'Modal'}
            style={style.modalContainer}
            position="center"
            backdrop={true}
            swipeToClose={false}>
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
                // value={this.state.title}
                onChangeText={belakang => this.setState({belakang})}
              />
              <Text style={style.label}>Email</Text>
              <TextInput
                placeholder="Masukkan Email"
                style={style.input}
                // value={this.state.title}
                onChangeText={email => this.setState({email})}
              />
              <Text style={style.label}>Password</Text>
              <TextInput
                secureTextEntry={true}
                placeholder="Masukkan Password"
                style={style.input}
                // value={this.state.title}
                onChangeText={password => this.setState({password})}
              />
              <Button
                title="Simpan"
                color="#779DCA"
                icon="ios-create"
                onPress={this.tambah.bind(this)}
              />
            </ScrollView>
          </Modal>
        </View>
      </>
    );
  }

  openModal() {
    this.refs.Modal.open();
  }
}

export default Admin;

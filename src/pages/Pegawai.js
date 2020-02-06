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
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'deptech4.db', createFromLocation: 1});

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

class Pegawai extends React.Component {
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
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          pegawai: temp,
        });
      });
    });
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM pegawai', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            pegawai: temp,
          });
        });
      });
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  tambah = () => {
    var that = this;
    const {depan, belakang, email, no, alamat, jk} = this.state;
    console.warn(alamat);
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
                            var temp = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                              temp.push(results.rows.item(i));
                            }
                            this.setState({
                              pegawai: temp,
                            });
                          },
                        );
                        Alert.alert(
                          'Berhasil',
                          'pegawai berhasil ditambahkan',
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
                alert('Jenis Kelamin belum diisi');
              }
            } else {
              alert('Alamat belum diisi');
            }
          } else {
            alert('Nomor HP belum diisi');
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
    if (this.state.pegawai.length != 0) {
      tampilan = (
        <FlatList
          data={this.state.pegawai}
          renderItem={({item}) => (
            <List
              depan={item.depan}
              belakang={item.belakang}
              email={item.email}
              onPress={() =>
                this.props.navigation.navigate('DetailPegawai', {id: item.id})
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
        <Header title="List Pegawai" />
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
              />
              <Text style={style.label}>No HP</Text>
              <TextInput
                placeholder="Masukkan Nomor HP"
                style={style.input}
                onChangeText={no => this.setState({no})}
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
          </Modal>
        </View>
      </>
    );
  }

  openModal() {
    this.refs.Modal.open();
  }
}

export default Pegawai;

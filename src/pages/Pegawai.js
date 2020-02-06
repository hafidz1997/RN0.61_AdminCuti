import React from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import Header from '../components/Header';
import AddButton from '../components/AddButton';
import List from '../components/List';
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

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
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
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

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
          <AddButton
            onPress={() => this.props.navigation.navigate('TambahPegawai')}
          />
        </View>
      </>
    );
  }
}

export default Pegawai;

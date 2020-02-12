import React from 'react';
import {StyleSheet, View, Text, FlatList, RefreshControl} from 'react-native';
import Header from '../components/Header';
import AddButton from '../components/AddButton';
import List from '../components/List';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'deptech6.db', createFromLocation: 1});

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
      refreshing: false,
    };
    this.getPegawai();
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.getPegawai();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  async getPegawai() {
    await db.transaction(tx => {
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

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getPegawai().then(() => {
      this.setState({refreshing: false});
    });
  };

  render() {
    let tampilan;
    if (this.state.pegawai.length !== 0) {
      tampilan = (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
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
        <View style={style.container}>
          {tampilan}
          <AddButton
            onPress={() => this.props.navigation.navigate('FormPegawai')}
          />
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

export default Pegawai;

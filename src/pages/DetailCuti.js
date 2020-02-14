import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import HeaderDetail from '../components/HeaderDetail';
import Button from '../components/Button';

import AddButton from '../components/AddButton';
import List from '../components/List';
import {ToastError, ToastSuccess} from '../helpers/function';

import db from '../helpers/variable';

class DetailCuti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      cuti: [],
      depan: '',
      belakang: '',
      idp: '',
      alasan: '',
      awal: new Date(),
      akhir: new Date(),
      hari: '',
      sisa: 5,
      refreshing: false,
    };
    this.getCuti();
  }

  hapus = id => {
    Alert.alert('Hapus Cuti', 'Apakah anda yakin akan menghapus Cuti?', [
      {text: 'Tidak'},
      {text: 'Iya', onPress: () => this.deletecuti(id)},
    ]);
  };

  deletecuti = id => {
    let that = this;
    db.transaction(tx => {
      tx.executeSql('DELETE FROM cuti where id=?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          let id = this.props.navigation.getParam('id', 0);
          db.transaction(tx => {
            tx.executeSql(
              `SELECT
              depan,
              belakang,
              cuti.*,
              julianday(cuti.akhir)-julianday(cuti.awal)+1 AS hari,
              (SELECT
                5 - sum(julianday(cuti.akhir)-julianday(cuti.awal)+1) FROM
                      pegawai JOIN cuti ON cuti.id_pegawai = pegawai.id
                WHERE pegawai.id = ?) AS sisa
          FROM
              pegawai
          JOIN cuti ON
              cuti.id_pegawai = pegawai.id
          WHERE pegawai.id = ?`,
              [id, id],
              (tx, results) => {
                let len = results.rows.length;
                if (len > 0) {
                  let temp = [];
                  for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                  }
                  this.setState({
                    cuti: temp,
                    id: results.rows.item(0).id,
                    depan: results.rows.item(0).depan,
                    belakang: results.rows.item(0).belakang,
                    sisa: results.rows.item(0).sisa,
                    idp: results.rows.item(0).id_pegawai,
                  });
                } else {
                  this.setState({
                    cuti: '',
                  });
                }
              },
            );
          });
          ToastSuccess('Cuti', 'hapus');
          that.props.navigation.navigate('pegawai');
        } else {
          ToastError();
        }
      });
    });
  };

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.getCuti();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  async getCuti() {
    let id = this.props.navigation.getParam('id', 0);
    await db.transaction(tx => {
      tx.executeSql(
        `SELECT
            depan,
            belakang,
            cuti.*,
            julianday(cuti.akhir)-julianday(cuti.awal)+1 AS hari,
            (SELECT
              5 - sum(julianday(cuti.akhir)-julianday(cuti.awal)+1) FROM
                    pegawai JOIN cuti ON cuti.id_pegawai = pegawai.id
              WHERE pegawai.id = ?) AS sisa
        FROM
            pegawai
        JOIN cuti ON
            cuti.id_pegawai = pegawai.id
        WHERE pegawai.id = ?`,
        [id, id],
        (tx, results) => {
          let len = results.rows.length;
          if (len !== 0) {
            let temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            this.setState({
              cuti: temp,
              id: results.rows.item(0).id,
              depan: results.rows.item(0).depan,
              belakang: results.rows.item(0).belakang,
              sisa: results.rows.item(0).sisa,
              idp: results.rows.item(0).id_pegawai,
            });
          } else if (len === 0) {
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM pegawai where id = ?',
                [id],
                (tx, results) => {
                  let len = results.rows.length;
                  console.log('len', len);
                  if (len !== 0) {
                    this.setState({
                      depan: results.rows.item(0).depan,
                      belakang: results.rows.item(0).belakang,
                      idp: results.rows.item(0).id,
                    });
                  } else {
                    ToastError();
                  }
                },
              );
            });
          }
        },
      );
    });
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getCuti().then(() => {
      this.setState({refreshing: false});
    });
  };

  render() {
    let tampilan;
    let button;
    if (this.state.sisa > 0) {
      button = (
        <AddButton
          onPress={() =>
            this.props.navigation.navigate('FormCuti', {
              idp: this.state.idp,
            })
          }
        />
      );
    }
    if (this.state.cuti) {
      tampilan = (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          nestedScrollEnabled={true}
          data={this.state.cuti}
          renderItem={({item}) => (
            <List
              awal={item.awal}
              akhir={item.akhir}
              alasan={item.alasan}
              hari={item.hari}
              hapus={() => this.hapus(item.id)}
              update={() =>
                this.props.navigation.navigate('FormCuti', {
                  id: item.id,
                  idp: this.state.idp,
                })
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
        <HeaderDetail
          title="Detail Cuti Pegawai"
          onPress={() => this.props.navigation.pop()}
        />
        <SafeAreaView style={style.container}>
          <Text style={style.judul2}>Nama Pegawai</Text>
          <Text style={style.isi}>
            {this.state.depan} {this.state.belakang}
          </Text>
          <Button
            width={190}
            color="#779DCA"
            icon="md-open"
            title="Detail Pegawai"
            onPress={() =>
              this.props.navigation.navigate('DetailPegawai', {
                id: this.state.idp,
              })
            }
          />
          <View style={style.row}>
            <Text style={style.judul2}>List Cuti</Text>
            <Text style={style.kosong}>(sisa {this.state.sisa} hari)</Text>
          </View>
          {tampilan}
        </SafeAreaView>
        {button}
      </>
    );
  }
}

const style = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  container: {
    flex: 1,
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
  kosong: {
    fontSize: 20,
    color: 'grey',
    margin: 10,
  },
});

export default DetailCuti;

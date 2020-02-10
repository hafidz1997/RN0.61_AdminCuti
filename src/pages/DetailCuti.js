import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  ToastAndroid,
} from 'react-native';
import HeaderDetail from '../components/HeaderDetail';
import Button from '../components/Button';
import Modal from 'react-native-modalbox';
import {openDatabase} from 'react-native-sqlite-storage';
import AddButton from '../components/AddButton';
import List from '../components/List';
import DatePicker from 'react-native-datepicker';
let db = openDatabase({name: 'deptech6.db', createFromLocation: 1});

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
      jml: 0,
    };
    let id = this.props.navigation.getParam('id', 0);
    this.setState({
      id: id,
    });
    // console.warn(id);
    db.transaction(tx => {
      tx.executeSql(
        `SELECT
            depan,
            belakang,
            cuti.*,
            julianday(cuti.akhir)-julianday(cuti.awal) AS hari,
            (SELECT
              sum(julianday(cuti.akhir)-julianday(cuti.awal)) FROM
                    pegawai JOIN cuti ON cuti.id_pegawai = pegawai.id
              WHERE pegawai.id = ?) AS jml
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
              jml: results.rows.item(0).jml,
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
                  if (len != 0) {
                    this.setState({
                      cuti: '',
                      depan: results.rows.item(0).depan,
                      belakang: results.rows.item(0).belakang,
                      idp: results.rows.item(0).id,
                    });
                  } else {
                    ToastAndroid.showWithGravity(
                      'No user found',
                      ToastAndroid.LONG,
                      ToastAndroid.CENTER,
                    );
                    this.setState({
                      cuti: '',
                    });
                  }
                },
              );
            });
          }
        },
      );
    });
  }

  hapus = id => {
    Alert.alert('Hapus Cuti', 'Apakah anda yakin akan menghapus Cuti?', [
      {text: 'Tidak'},
      {text: 'Iya', onPress: () => this.deletecuti(id)},
    ]);
  };

  deletecuti = id => {
    let that = this;
    // console.warn(id);
    db.transaction(tx => {
      tx.executeSql('DELETE FROM cuti where id=?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          let idp = this.state.idp;
          db.transaction(tx => {
            tx.executeSql(
              `SELECT
                    depan,
                    belakang,
                    cuti.*
                FROM
                    pegawai
                JOIN cuti ON
                    cuti.id_pegawai = pegawai.id
                WHERE pegawai.id = ?`,
              [idp],
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
          ToastAndroid.showWithGravity(
            'Cuti berhasil dihapus',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
          that.props.navigation.navigate('pegawai');
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
      this.setState({
        idp: id,
      });

      db.transaction(tx => {
        tx.executeSql(
          `SELECT
              depan,
              belakang,
              cuti.*,
              julianday(cuti.akhir)-julianday(cuti.awal) AS hari,
              (SELECT
                sum(julianday(cuti.akhir)-julianday(cuti.awal)) FROM
                      pegawai JOIN cuti ON cuti.id_pegawai = pegawai.id
                WHERE pegawai.id = ?) AS jml
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
                jml: results.rows.item(0).jml,
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
                    if (len != 0) {
                      this.setState({
                        cuti: '',
                        depan: results.rows.item(0).depan,
                        belakang: results.rows.item(0).belakang,
                        idp: results.rows.item(0).id,
                      });
                    } else {
                      ToastAndroid.showWithGravity(
                        'No user found',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                      );
                      this.setState({
                        cuti: '',
                      });
                    }
                  },
                );
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
    let tampilan;
    let button;
    let maks;
    // console.warn(this.state.jml);
    if (this.state.jml < 5) {
      button = (
        <AddButton
          onPress={() =>
            this.props.navigation.navigate('FormCuti', {
              idp: this.state.idp,
            })
          }
        />
      );
    } else {
      maks = <Text style={style.kosong}>(Cuti Sudah Maksimum)</Text>;
    }
    if (this.state.cuti) {
      tampilan = (
        <FlatList
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
        <SafeAreaView style={{flex: 1}}>
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
          <View style={{flexDirection: 'row'}}>
            <Text style={style.judul2}>List Cuti</Text>
            {maks}
          </View>
          {tampilan}
        </SafeAreaView>
        {button}
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
  kosong: {
    fontSize: 20,
    color: 'grey',
    margin: 10,
  },
});

export default DetailCuti;

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  ToastAndroid,
} from 'react-native';
import HeaderDetail from '../components/HeaderDetail';
import Button from '../components/Button';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'deptech6.db', createFromLocation: 1});
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';

class FormCuti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      // idp: '',
      cuti: [],
      depan: '',
      belakang: '',
      alasan: '',
      awal: '',
      akhir: '',
      thisDay: new Date(),
    };
    let id = this.props.navigation.getParam('id', 0);
    let idp = this.props.navigation.getParam('idp', 0);
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
        WHERE pegawai.id = ? AND cuti.id = ?`,
        [idp, id],
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
              awal: results.rows.item(0).awal,
              akhir: results.rows.item(0).akhir,
              alasan: results.rows.item(0).alasan,
              judul: 'Update Cuti',
            });
            // console.warn(this.state.alasan);
          } else if (len === 0) {
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM pegawai where id = ?',
                [idp],
                (tx, results) => {
                  this.setState({
                    cuti: [],
                    depan: results.rows.item(0).depan,
                    belakang: results.rows.item(0).belakang,
                    judul: 'Tambah Cuti',
                  });
                },
              );
            });
          }
        },
      );
    });
  }

  tambah = () => {
    let that = this;
    let idp = this.props.navigation.getParam('idp', 0);
    const {awal, akhir, alasan} = this.state;
    if (awal) {
      if (akhir) {
        if (alasan) {
          db.transaction(tx => {
            tx.executeSql(
              'INSERT INTO cuti (id_pegawai, alasan, awal, akhir) VALUES (?,?,?,?)',
              [idp, alasan, awal, akhir],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  ToastAndroid.showWithGravity(
                    'Cuti berhasil ditambahkan',
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
            'Alasan Cuti belum diisi',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      } else {
        ToastAndroid.showWithGravity(
          'Tanggal Berakhir belum diisi',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    } else {
      ToastAndroid.showWithGravity(
        'Tanggal Mulai belum diisi',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  };

  update = () => {
    let that = this;
    let {id} = this.state;
    const {awal, akhir, alasan} = this.state;
    // let id = this.props.navigation.getParam('id', 0);
    // console.warn(depan);
    if (awal) {
      if (akhir) {
        if (alasan) {
          db.transaction(tx => {
            tx.executeSql(
              'UPDATE cuti set awal=?, akhir=?, alasan=? where id=?',
              [awal, akhir, alasan, id],
              (tx, results) => {
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
                    'Cuti berhasil di update',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                  );
                  that.props.navigation.pop();
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
            'Alasan belum diisi',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      } else {
        ToastAndroid.showWithGravity(
          'Tanggal Berakhir belum diisi',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    } else {
      ToastAndroid.showWithGravity(
        'Tanggal Mulai belum diisi',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  };

  render() {
    let tampilan;
    if (this.state.cuti.length !== 0) {
      tampilan = (
        <Button
          title="Update"
          color="#779DCA"
          icon="md-create"
          alignSelf="center"
          onPress={this.update.bind(this)}
        />
      );
    } else {
      tampilan = (
        <Button
          title="Simpan"
          color="#779DCA"
          icon="ios-create"
          alignSelf="center"
          onPress={this.tambah.bind(this)}
        />
      );
    }
    return (
      <>
        <HeaderDetail
          title={this.state.judul}
          onPress={() => this.props.navigation.pop()}
        />
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
            <Text style={style.judul}>{this.state.judul}</Text>
            <Text style={style.label}>Tanggal Mulai</Text>
            <DatePicker
              style={{width: 200, margin: 15}}
              date={this.state.awal}
              mode="date"
              placeholder="Select Date"
              format="YYYY-MM-DD"
              minDate={this.state.thisDay}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
              }}
              onDateChange={date => {
                this.setState({awal: date});
              }}
            />
            <Text style={style.label}>Tanggal Berakhir</Text>
            <DatePicker
              style={{width: 200, margin: 15}}
              date={this.state.akhir}
              mode="date"
              placeholder="Select Date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
              }}
              onDateChange={date => {
                this.setState({akhir: date});
              }}
            />
            <Text style={style.label}>Alasan Cuti</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder="Masukkan Alasan Cuti"
              style={style.input}
              onChangeText={alasan => this.setState({alasan})}
              value={this.state.alasan}
            />
            {tampilan}
          </ScrollView>
        </View>
      </>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
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
  icon: {
    width: 25,
    justifyContent: 'center',
    alignContent: 'center',
    lineHeight: 50,
    height: 50,
    marginTop: 20,
  },
  foto: {width: 200, height: 200, margin: 20},
});

export default FormCuti;

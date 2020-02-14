import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import HeaderDetail from '../components/HeaderDetail';
import Button from '../components/Button';
import DatePickers from '../components/DatePickers';

import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {ToastError, ToastSuccess, ToastEmpty} from '../helpers/function';
import Icon from 'react-native-vector-icons/Ionicons';

import db from '../helpers/variable';

class FormCuti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      cuti: [],
      depan: '',
      belakang: '',
      alasan: '',
      awal: '',
      akhir: '',
      thisDay: new Date(),
      sisa: '',
      show1: false,
      show2: false,
    };
    let id = this.props.navigation.getParam('id', 0);
    let idp = this.props.navigation.getParam('idp', 0);
    db.transaction(tx => {
      tx.executeSql(
        `SELECT
            depan,
            belakang,
            cuti.*,
            (SELECT
              5 - sum(julianday(cuti.akhir)-julianday(cuti.awal)+1) FROM
                    pegawai JOIN cuti ON cuti.id_pegawai = pegawai.id
              WHERE pegawai.id = ?) AS sisa
        FROM
            pegawai
        JOIN cuti ON
            cuti.id_pegawai = pegawai.id
        WHERE pegawai.id = ? AND cuti.id = ?`,
        [idp, idp, id],
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
              awal: results.rows.item(0).awal,
              akhir: results.rows.item(0).akhir,
              alasan: results.rows.item(0).alasan,
              judul: 'Update Cuti',
            });
            // console.warn(this.state.alasan);
          } else if (len === 0) {
            db.transaction(tx => {
              tx.executeSql(
                `SELECT
                depan,
                belakang,
                cuti.*,
                (SELECT
                  5 - sum(julianday(cuti.akhir)-julianday(cuti.awal)+1) FROM
                        pegawai JOIN cuti ON cuti.id_pegawai = pegawai.id
                  WHERE pegawai.id = ?) AS sisa
            FROM
                pegawai
            JOIN cuti ON
                cuti.id_pegawai = pegawai.id
            WHERE pegawai.id = ?`,
                [idp, idp],
                (tx, results) => {
                  let len = results.rows.length;
                  if (len !== 0) {
                    this.setState({
                      cuti: [],
                      depan: results.rows.item(0).depan,
                      belakang: results.rows.item(0).belakang,
                      sisa: results.rows.item(0).sisa,
                      judul: 'Tambah Cuti',
                    });
                  } else {
                    this.setState({
                      judul: 'Tambah Cuti',
                      sisa: 5,
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

  showDatepicker1 = () => {
    this.setState({show1: true});
  };
  showDatepicker2 = () => {
    this.setState({show2: true});
  };

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
                  ToastSuccess('Cuti', 'tambah');
                  that.props.navigation.pop();
                } else {
                  ToastError();
                }
              },
            );
          });
        } else {
          ToastEmpty('Alasan Cuti');
        }
      } else {
        ToastEmpty('Tanggal Berakhir');
      }
    } else {
      ToastEmpty('Tanggal Mulai');
    }
  };

  update = () => {
    let that = this;
    let {id} = this.state;
    const {awal, akhir, alasan} = this.state;
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
                  ToastSuccess('Cuti', 'update');
                  that.props.navigation.pop();
                } else {
                  ToastError();
                }
              },
            );
          });
        } else {
          ToastEmpty('Alasan Cuti');
        }
      } else {
        ToastEmpty('Tanggal Berakhir');
      }
    } else {
      ToastEmpty('Tanggal Mulai');
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
    let {sisa, judul, awal, akhir} = this.state;
    let max;
    if (judul === 'Tambah Cuti') {
      max = moment(awal)
        .add(sisa, 'day')
        .format('YYYY-MM-DD');
    } else if (judul === 'Update Cuti') {
      max = moment(akhir)
        .add(sisa, 'day')
        .format('YYYY-MM-DD');
    }
    let txt;
    let val;
    let txt2;
    let val2;
    //mulai
    if (awal) {
      txt = awal;
      val = awal;
    } else {
      txt = 'Pilih Tanggal';
      val = new Date();
    }
    //berakhir
    if (akhir) {
      txt2 = akhir;
      val2 = akhir;
    } else {
      txt2 = 'Pilih Tanggal';
      val2 = new Date();
    }

    return (
      <>
        <HeaderDetail
          title={this.state.judul}
          onPress={() => this.props.navigation.pop()}
        />
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
            <Text style={style.judul}>
              {this.state.judul} {this.state.depan} {this.state.belakang}
            </Text>

            <Text style={style.label}>Tanggal Mulai</Text>
            <View>
              <TouchableOpacity
                style={style.date}
                onPress={this.showDatepicker1.bind(this)}>
                <Icon
                  style={style.icon}
                  name="md-calendar"
                  size={30}
                  color="#779DCA"
                />
                <Text>{txt}</Text>
              </TouchableOpacity>
            </View>
            {this.state.show1 && (
              <DatePickers
                value={val}
                // min={this.state.thisDay}
                onChange={(event, date) => {
                  this.setState({
                    awal: moment(date).format('YYYY-MM-DD'),
                    show1: false,
                  });
                }}
              />
            )}

            <Text style={style.label}>Tanggal Berakhir</Text>
            <View>
              <TouchableOpacity
                style={style.date}
                onPress={this.showDatepicker2.bind(this)}>
                <Icon
                  style={style.icon}
                  name="md-calendar"
                  size={30}
                  color="#779DCA"
                />
                <Text>{txt2}</Text>
              </TouchableOpacity>
            </View>
            {this.state.show2 && (
              <DatePickers
                value={val2}
                max={max}
                min={this.state.awal}
                onChange={(event, date) => {
                  this.setState({
                    akhir: moment(date).format('YYYY-MM-DD'),
                    show2: false,
                  });
                }}
              />
            )}
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
    marginRight: 10,
  },
  foto: {width: 200, height: 200, margin: 20},
  date: {
    borderWidth: 1,
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    flexDirection: 'row',
    padding: 10,
  },
});

export default FormCuti;

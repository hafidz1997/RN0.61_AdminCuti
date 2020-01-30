import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, TextInput, Alert, FlatList} from 'react-native';
import HeaderDetail from '../components/HeaderDetail';
import Button from '../components/Button';
import Modal from 'react-native-modalbox';
import { openDatabase } from 'react-native-sqlite-storage';
import AddButton from '../components/AddButton';
import List from '../components/List';
import DatePicker from 'react-native-datepicker';
var db = openDatabase({ name: 'deptech3.db', createFromLocation : 1});

const style = StyleSheet.create({
    modalContainer: {
        // justifyContent: 'center',
        borderRadius: 8,
        shadowRadius: 10,
        width: '90%',
        height: 300,
        padding: 10
      },
      judul:{
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 20
      },
      label:{
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 20
      },
      input:{
        borderColor: 'grey',
        borderWidth: 1,
        margin: 20,
      },
    judul2: {
        color: '#7E94B3',
        fontWeight: 'bold',
        fontSize: 20,
        margin: 5
    },
    isi: {
        color: '#1D3962',
        fontSize: 20,
        margin: 5,
        flexDirection: 'row'
    },
    garis: {
        borderBottomColor: '#EAEFF7',
        borderBottomWidth: 1,
        marginBottom: 12
    },
    radio:{
        margin: 20,
    },
    kosong:{
      fontSize:20,
      color: 'grey',
      margin: 10
    }
  })

  let radio_props = [
    {label: 'Pria', value: 'Pria' },
    {label: 'Wanita', value: 'Wanita'}
  ];  


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
        };
        let id = this.props.navigation.getParam('id', 0);
        this.setState({
          idp:id
        })
        // console.warn(id);
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
          [id], 
          (tx, results) => {
            let len = results.rows.length;
            if (len !== 0) {
              var temp = [];
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
            } else if(len === 0) {
              db.transaction(tx => {
                tx.executeSql('SELECT * FROM pegawai where id = ?', 
                [id], 
                (tx, results) => {
                  let len = results.rows.length;
                  console.log('len', len);
                  if (len != 0) {
                    this.setState({
                      cuti: '',
                      depan: results.rows.item(0).depan,
                      belakang: results.rows.item(0).belakang,
                      idp: results.rows.item(0).id
                    });
                  } else{
                      alert('No user found');
                      this.setState({
                        cuti: '',
                      });
                  }
                });
              });
            }
      });
    });
    }

    render() {
      let tampilan;
      // console.warn(this.state.cuti);
      if(this.state.cuti){
        tampilan = 
        <FlatList
        nestedScrollEnabled={true} 
        data={this.state.cuti}
        renderItem={({item})=>
        <List
        awal={item.awal}
        akhir={item.akhir}
        alasan={item.alasan}
        hapus={() => this.hapus(item.id)}
        update={() => this.openModal2(item.id)}
        />
        }
        keyExtractor={(item) => item.id.toString()} 
       />
      }else{
        tampilan = <Text style={style.kosong}>No Data</Text>
      }
      return (
          <>
          <HeaderDetail
          title="Detail Cuti Pegawai"
          onPress={()=> this.props.navigation.pop()}
          />
            <SafeAreaView style={{flex: 1}}>
            <Text style={style.judul2}>Nama Pegawai</Text>
            <Text style={style.isi}>{this.state.depan} {this.state.belakang}</Text>
            <Button
            width={190}
            color='#779DCA'
            icon='md-open'
            title='Detail Pegawai'
            onPress={()=>this.props.navigation.navigate('DetailPegawai',{id:this.state.idp})}
            />
            <Text style={style.judul2}>List Cuti</Text>
            {tampilan}
            </SafeAreaView>
            <AddButton
            onPress={this.openModal.bind(this)}
            />
            <Modal ref={"Tambah"} style={style.modalContainer} position='center'
              backdrop={true} swipeToClose={false}>
                <ScrollView>
                <Text style={style.judul}>Tambah Cuti</Text>
                <Text style={style.label}>Tanggal Mulai</Text>
                <DatePicker
                  style={{width: 200, margin: 15}}
                  date={this.state.awal}
                  mode="date"
                  // placeholder="select date"
                  format="DD/MM/YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={(date) => {this.setState({awal: date})}}
                />
                <Text style={style.label}>Tanggal Berakhir</Text>
                <DatePicker
                  style={{width: 200, margin: 15}}
                  date={this.state.akhir}
                  mode="date"
                  // placeholder="select date"
                  format="DD/MM/YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {this.setState({akhir: date})}}
                />
                <Text style={style.label}>Alasan Cuti</Text>
                <TextInput
                multiline={true}
                numberOfLines={4} 
                placeholder='Masukkan Alasan Cuti'
                style={style.input}
                onChangeText={(alasan) => this.setState({alasan})} 
                value={this.state.alasan}
                />
                <Button
                  title='Simpan'
                  color='#779DCA'
                  icon='ios-create'
                  onPress={this.tambah.bind(this)}
                />
                </ScrollView>
              </Modal>

            <Modal ref={"Update"} style={style.modalContainer} position='center'
              backdrop={true} swipeToClose={false}>
                <ScrollView>
                <Text style={style.judul}>Update Cuti</Text>
                <Text style={style.label}>Tanggal Mulai</Text>
                <DatePicker
                  style={{width: 200, margin: 15}}
                  date={this.state.awal}
                  mode="date"
                  placeholder="select date"
                  format="DD/MM/YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={(date) => {this.setState({awal: date})}}
                />
                <Text style={style.label}>Tanggal Berakhir</Text>
                <DatePicker
                  style={{width: 200, margin: 15}}
                  date={this.state.akhir}
                  mode="date"
                  placeholder="select date"
                  format="DD/MM/YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {this.setState({akhir: date})}}
                />
                <Text style={style.label}>Alasan Cuti</Text>
                <TextInput
                multiline={true}
                numberOfLines={4} 
                placeholder='Masukkan Alasan Cuti'
                style={style.input}
                onChangeText={(alasan) => this.setState({alasan})} 
                value={this.state.alasan}
                />
                <Button
                  title='Simpan'
                  color='#779DCA'
                  icon='ios-create'
                  onPress={this.tambah.bind(this)}
                />
                </ScrollView>
              </Modal>
          </>
      );
    }

    tambah = () => {
      var that = this;
      let id = this.state.idp;
      const { awal, akhir, alasan} = this.state;
      if (awal) {
        if(akhir){
        if (alasan) {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT INTO cuti (id_pegawai, alasan, awal, akhir) VALUES (?,?,?,?)',
                [id, alasan, awal, akhir],
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
                          var temp = [];
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
                        } else{
                          this.setState({
                            cuti: '',
                          });
                        }   
                    });
                  });
                    Alert.alert(
                      'Berhasil',
                      'Cuti berhasil ditambahkan',
                      [
                        {
                          text: 'Ok',
                          onPress: () =>
                                that.refs.Tambah.close(),
                        },
                      ],
                      { cancelable: false }
                    );
                  } else {
                    alert('Gagal');
                  }
                }
              );
            });
        } else {
          alert('Alasan Cuti belum diisi');
        }
      } else {
        alert('Tanggal Mulai belum diisi');
      }
    }else {
      alert('Tanggal Berakhir belum diisi');
    }
    };

    update = (id) =>{
        var that=this;
        const { awal, akhir, alasan } = this.state;
        // console.warn(depan);
        if (awal){
          if (akhir){
            if (alasan){
              db.transaction((tx)=> {
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
                          var temp = [];
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
                        } else{
                          this.setState({
                            cuti: '',
                          });
                        }   
                    });
                  });
                      Alert.alert( 'Berhasil', 'cuti berhasil di update',
                        [
                          {text: 'Ok', onPress: () => that.refs.Update.close()},
                        ],
                        { cancelable: false }
                      );
                    }else{
                      alert('Update gagal');
                    }
                  }
                );
              });
            }else{
              alert('Alasan belum diisi');
            }
          }else{
            alert('Tanggal Mulai belum diisi');
          }
        }else{
          alert('Tanggal Berakhir belum diisi');
        }
    }

    openModal(){
        this.refs.Tambah.open();
    }
    openModal2 = (id) =>{
        this.refs.Update.open(id);
    }

    hapus = (id) =>{
        Alert.alert(
            'Hapus Cuti',
            'Apakah anda yakin akan menghapus Cuti?',
            [
              {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
              {text: 'YES', onPress: () => this.deletecuti(id)},
            ]
        );
    }

    deletecuti = (id) => {
        var that = this;
        // console.warn(id);
        db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM cuti where id=?',
            [id],
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
                      var temp = [];
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
                    } else{
                      this.setState({
                        cuti: '',
                      });
                    }   
                });
              });
                Alert.alert(
                  'Berhasil',
                  'cuti berhasil dihapus',
                  [
                    {
                      text: 'Ok',
                      onPress: () => that.props.navigation.navigate('pegawai'),
                    },
                  ],
                  { cancelable: false }
                );
              } else {
                alert('Gagal');
              }
            }
          );
        });
      };

}



export default DetailCuti;
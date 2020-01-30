import React from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, FlatList, Alert} from 'react-native';
import Header from '../components/Header';
import List from '../components/List';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'deptech4.db', createFromLocation : 1});


const style = StyleSheet.create({
    container: {
      flex: 1
    },
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
    radio:{
      margin: 20,
    },
    kosong:{
      fontSize:20,
      color: 'grey',
      alignSelf: 'center',
      marginTop:'50%'
    }
  })

  let radio_props = [
    {label: 'Pria', value: 'Pria' },
    {label: 'Wanita', value: 'Wanita'}
  ];  

class Cuti extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pegawai: [],
      depan: '',
      belakang: '',
      email: '',
      no: '',
      alamat: '',
      jk: ''
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
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      db.transaction(tx => {
        tx.executeSql('SELECT pegawai.id AS id, depan, belakang, 5-COUNT(cuti.id_pegawai) AS sisa FROM pegawai LEFT JOIN cuti ON cuti.id_pegawai = pegawai.id GROUP BY pegawai.id ORDER BY COUNT(cuti.id_pegawai) DESC', 
        [], (tx, results) => {
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
 
    render() {
      let tampilan;
      if(this.state.pegawai.length != 0){
        tampilan = <FlatList
        data={this.state.pegawai}
        renderItem={({item})=>
        <List
        depan={item.depan}
        belakang={item.belakang}
        cuti={item.sisa}
        onPress={()=>this.props.navigation.navigate('DetailCuti',{id:item.id})}
        />
        }
        keyExtractor={(item) => item.id.toString()} 
       />
      }else{
        tampilan = <Text style={style.kosong}>No Data</Text>
      }
      return (
          <>
              <Header title="List Cuti Pegawai"/>
              <View style={{flex:1}}>
              {tampilan}
              </View>
          </>
      );
    }

    openModal(){
      this.refs.Modal.open();
    }

}



export default Cuti;
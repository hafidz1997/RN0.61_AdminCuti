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

  render() {
    let tampilan;
    if (this.state.admin.length !== 0) {
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
        <View style={style.container}>
          {tampilan}
          <AddButton
            onPress={() => this.props.navigation.navigate('FormAdmin')}
          />
        </View>
      </>
    );
  }
}

export default Admin;

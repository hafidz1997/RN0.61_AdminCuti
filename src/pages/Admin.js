import React from 'react';
import {StyleSheet, View, Text, FlatList, RefreshControl} from 'react-native';
import Header from '../components/Header';
import AddButton from '../components/AddButton';
import List from '../components/List';
import AsyncStorage from '@react-native-community/async-storage';
import db from '../helpers/variable';
// import PushNotification from 'react-native-push-notification';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: [],
      depan: '',
      belakang: '',
      email: '',
      password: '',
      profil: [],
      refreshing: false,
    };
    this.getAdmin();
  }

  componentDidMount() {
    this.getStorage();
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.getAdmin();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  async getStorage() {
    const dt = await AsyncStorage.getItem('dt');
    this.setState({profil: JSON.parse(dt)});
  }

  async getAdmin() {
    await db.transaction(txn => {
      txn.executeSql('SELECT * FROM admin', [], (tx, results) => {
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

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getAdmin().then(() => {
      this.setState({refreshing: false});
    });
  };

  render() {
    let tampilan;
    if (this.state.admin.length > 1) {
      tampilan = (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          data={this.state.admin}
          renderItem={({item}) => {
            if (item.id !== this.state.profil.id) {
              return (
                <List
                  depan={item.depan}
                  belakang={item.belakang}
                  email={item.email}
                  onPress={() =>
                    this.props.navigation.navigate('DetailAdmin', {id: item.id})
                  }
                />
              );
            }
          }}
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

export default Admin;

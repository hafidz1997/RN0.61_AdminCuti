import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Button from '../components/Button';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'deptech4.db', createFromLocation: 1});
import AsyncStorage from '@react-native-community/async-storage';

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
  kosong: {
    fontSize: 20,
    color: 'grey',
    alignSelf: 'center',
    marginTop: '50%',
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  login = () => {
    var that = this;
    const {email, password} = this.state;
    if (email) {
      if (password) {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM admin WHERE email = ? AND password = ?',
            [email, password],
            (tx, results) => {
              if (results.rows.length > 0) {
                AsyncStorage.setItem('isLoggedIn', '1');
                AsyncStorage.setItem(
                  'dt',
                  JSON.stringify(results.rows.item(0)),
                );
                Alert.alert(
                  'Berhasil',
                  'Login berhasil',
                  [
                    {
                      text: 'Ok',
                      onPress: () => that.props.navigation.navigate('Tab'),
                    },
                  ],
                  {cancelable: false},
                );
              } else {
                alert('Email atau Password salah');
              }
            },
          );
        });
      } else {
        alert('Password belum diisi');
      }
    } else {
      alert('Email belum diisi');
    }
  };

  render() {
    return (
      <>
        <Text style={style.judul}>Login</Text>
        <Text style={style.label}>Email</Text>
        <TextInput
          placeholder="Masukkan Email"
          style={style.input}
          // value={this.state.title}
          onChangeText={email => this.setState({email})}
        />
        <Text style={style.label}>Password</Text>
        <TextInput
          secureTextEntry={true}
          placeholder="Masukkan Password"
          style={style.input}
          // value={this.state.title}
          onChangeText={password => this.setState({password})}
        />
        <Button
          title="Login"
          color="#779DCA"
          icon="md-open"
          onPress={this.login.bind(this)}
        />
      </>
    );
  }

  openModal() {
    this.refs.Modal.open();
  }
}

export default Login;

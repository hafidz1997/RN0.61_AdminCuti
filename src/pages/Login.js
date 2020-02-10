import React from 'react';
import {StyleSheet, Text, TextInput, View, ToastAndroid} from 'react-native';
import Button from '../components/Button';
import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';

let db = openDatabase({name: 'deptech6.db', createFromLocation: 1});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      pass: true,
      checked: false,
    };
  }

  showpass() {
    this.setState(prevState => ({
      pass: !prevState.pass,
      checked: !prevState.checked,
    }));
  }

  login = () => {
    let that = this;
    const {email, password} = this.state;
    if (email) {
      if (password) {
        db.transaction(txn => {
          txn.executeSql(
            'SELECT * FROM admin WHERE email = ? AND password = ?',
            [email, password],
            (tx, results) => {
              if (results.rows.length > 0) {
                AsyncStorage.setItem('isLoggedIn', '1');
                AsyncStorage.setItem(
                  'dt',
                  JSON.stringify(results.rows.item(0)),
                );
                ToastAndroid.showWithGravity(
                  'Login Berhasil',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );
                that.props.navigation.navigate('Tab');
              } else {
                ToastAndroid.showWithGravity(
                  'Email atau Password salah',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );
              }
            },
          );
        });
      } else {
        ToastAndroid.showWithGravity(
          'Password belum diisi',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    } else {
      ToastAndroid.showWithGravity(
        'Email belum diisi',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
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
          onChangeText={email => this.setState({email})}
          keyboardType="email-address"
        />
        <Text style={style.label}>Password</Text>
        <TextInput
          secureTextEntry={this.state.pass}
          placeholder="Masukkan Password"
          style={style.input}
          onChangeText={password => this.setState({password})}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CheckBox
            style={{marginLeft: 15}}
            value={this.state.checked}
            onChange={() => this.showpass()}
          />
          <Text>Show Password</Text>
        </View>
        <Button
          title="Login"
          color="#779DCA"
          icon="md-open"
          alignSelf="center"
          onPress={this.login.bind(this)}
          width="80%"
        />
      </>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 25,
    justifyContent: 'center',
    alignContent: 'center',
    lineHeight: 50,
    height: 50,
    marginTop: 20,
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

export default Login;

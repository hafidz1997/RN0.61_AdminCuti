import React from 'react';
import {StyleSheet, Text, TextInput, View, ToastAndroid} from 'react-native';
import Button from '../components/Button';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'deptech4.db', createFromLocation: 1});
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

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

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      icon: 'md-eye-off',
      pass: true,
    };
  }

  showpass() {
    this.setState(prevState => ({
      icon: prevState.icon === 'md-eye' ? 'md-eye-off' : 'md-eye',
      pass: !prevState.pass,
    }));
  }

  login = () => {
    let that = this;
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
        <View style={{flexDirection: 'row'}}>
          <TextInput
            secureTextEntry={this.state.pass}
            placeholder="Masukkan Password"
            style={[style.input, {width: '85%'}]}
            onChangeText={password => this.setState({password})}
          />
          <Icon
            name={this.state.icon}
            onPress={() => this.showpass()}
            size={25}
            color="black"
            style={style.icon}
          />
        </View>
        <Button
          title="Login"
          color="#779DCA"
          icon="md-open"
          onPress={this.login.bind(this)}
          width="95%"
        />
      </>
    );
  }
}

export default Login;

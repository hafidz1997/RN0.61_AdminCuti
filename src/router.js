import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {
  Admin,
  Pegawai,
  Cuti,
  DetailAdmin,
  TambahAdmin,
  DetailPegawai,
  DetailCuti,
  Login,
  AuthLoading,
  Profil,
} from './pages';

const AdminScreen = createStackNavigator(
  {
    Admin,
    DetailAdmin,
    TambahAdmin,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Admin',
  },
);

AdminScreen.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const PegawaiScreen = createStackNavigator(
  {
    Pegawai,
    DetailPegawai,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Pegawai',
  },
);

PegawaiScreen.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const CutiScreen = createStackNavigator(
  {
    Cuti,
    DetailCuti,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Cuti',
  },
);

CutiScreen.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const Tab = createBottomTabNavigator(
  {
    Admin: AdminScreen,
    Pegawai: PegawaiScreen,
    Cuti: CutiScreen,
    Profil: Profil,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Admin') {
          iconName = 'md-contacts';
        } else if (routeName === 'Pegawai') {
          iconName = 'ios-people';
        } else if (routeName === 'Cuti') {
          iconName = 'md-calendar';
        } else if (routeName === 'Profil') {
          iconName = 'md-contact';
        }

        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#779DCA',
      inactiveTintColor: 'gray',
    },
  },
);

const Route = createSwitchNavigator(
  {
    AuthLoading,
    Login,
    Tab,
  },
  {
    headerMode: 'none',
    initialRouteName: 'AuthLoading',
  },
);

export default createAppContainer(Route);

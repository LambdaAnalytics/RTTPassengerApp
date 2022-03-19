import React from 'react';
// import { Platform, Text } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import AccountScreen from '../screens/AccountScreen';
import AutoCompleteMap from '../screens/AutoCompleteMap';
import { Header, Left, Container, Body, Title, Right, Icon, Content, Input, Item, Card, DatePicker, Label } from "native-base";
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar, Button, AsyncStorage, FlatList, ActivityIndicator } from 'react-native';
// import { Constants } from 'expo';
import Constants from 'expo-constants'
import BookingDetailsScreen from '../screens/BookingDetailsScreen';
import BookingScreen2 from '../screens/BookingScreen2';
import BookingScreen3 from '../screens/BookingScreen3';
import OnGoingActionScreen from '../screens/OnGoingActionScreen';
import PastActionScreen from '../screens/PastActionScreen';
import PendingActionScreen from '../screens/PendingActionScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

// SafeAreaView.setStatusBarHeight(0);


const HomeStack = createStackNavigator({
  Home: HomeScreen,
  AutoCompleteMap: AutoCompleteMap
});

HomeStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : ''}`
          : 'md-home'
      }
    />
  ),
};

const MyActionsTopTabNavigator = createMaterialTopTabNavigator(
  {
    "Pending": PendingActionScreen,
    "On-Going": OnGoingActionScreen,
    "Past": PastActionScreen
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#F8F8F8',
      style: {
        backgroundColor: '#CA6C39',
      },
      labelStyle: {
        textAlign: 'center',
      },
      indicatorStyle: {
        borderBottomColor: '#87B56A',
        borderBottomWidth: 3,
      },
    },
  }
);

MyActionsTopTabNavigator.navigationOptions = ({ navigation }) => {
  // const { routeName } = navigation.state.routes[navigation.state.index];

  // You can do whatever you like here to pick the title based on the route name
  // const headerTitle = "My Boo";

  return {
    headerTitle: () =>
      <View style={{ flex: 1 }}>
        {/* <StatusBar hidden={true} /> */}
        {/* <View style={styles.statusBar} /> */}
        <Header
          style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>
          <Body style={{ flex: 0.4 }}>
            <Title style={{
              alignSelf: "center",
              color: "white"
            }}>My Actions</Title>
          </Body>
        </Header>
      </View>
  };
};

const MyActionsStack = createStackNavigator({
  MyActionsTopTabNavigator: MyActionsTopTabNavigator
});

MyActionsStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-document' : 'ios-document'}
    />
  ),
};


const BookingTopTabNavigator = createMaterialTopTabNavigator(
  {
    "Pending": BookingScreen,
    "In Progress": BookingScreen2,
    "Completed": BookingScreen3
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#F8F8F8',
      style: {
        backgroundColor: '#CA6C39',
      },
      labelStyle: {
        textAlign: 'center',
      },
      indicatorStyle: {
        borderBottomColor: '#87B56A',
        borderBottomWidth: 3,
      },
    },
  }
);

BookingTopTabNavigator.navigationOptions = ({ navigation }) => {
  // const { routeName } = navigation.state.routes[navigation.state.index];

  // You can do whatever you like here to pick the title based on the route name
  // const headerTitle = "My Boo";

  return {
    headerTitle: () =>
      <View>
        {/* <StatusBar hidden={true} /> */}
        {/* <View style={styles.statusBar} /> */}
        <Header
          style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>
          <Body>
            <Title style={{
              alignSelf: "center",
              color: "white"
            }}>My Bookings</Title>
          </Body>
          
        </Header>
      </View>
  };
};

const BookingsStack = createStackNavigator({
  BookingTopTabNavigator: BookingTopTabNavigator,
  BookingDetailsScreen: BookingDetailsScreen
});

/* const BookingsStack = createStackNavigator({
  BookingTopTabNavigator: BookingTopTabNavigator,
  BookingDetailsScreen: BookingDetailsScreen
}, {
  headerMode: 'none'
}); */

BookingsStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-list' : 'ios-list'}
    />
  ),
};

const AccountsStack = createStackNavigator({
  Accounts: AccountScreen,
  EditProfile: EditProfileScreen
});

AccountsStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
    />
  ),
};

const BookingBottomTabNavigator = createMaterialBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    "My Actions": { screen: MyActionsStack },
    "My Bookings": { screen: BookingsStack },
    Account: { screen: AccountsStack }
  },
  {
    initialRouteName: 'Home',
    activeColor: '#FFFFFF',
    inactiveColor: '#000000',
    barStyle: { backgroundColor: '#CA6C39' }
  });

BookingBottomTabNavigator.navigationOptions = ({ navigation }) => {
  // const { routeName } = navigation.state.routes[navigation.state.index];

  // You can do whatever you like here to pick the title based on the route name
  // const headerTitle = "My Boo";

  return {
    headerTitle: () =>
      <View>
        {/* <StatusBar hidden={true} /> */}
        {/* <View style={styles.statusBar} /> */}
        <Header
          style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>
          <Body>
            <Title style={{
              alignSelf: "center",
              color: "white"
            }}>My Bookings</Title>
          </Body>
        </Header>
      </View>
  };
};

export default BookingBottomTabNavigator;

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#A3552A",
    height: Constants.statusBarHeight
  }
});


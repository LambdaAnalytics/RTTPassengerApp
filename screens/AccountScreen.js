import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar,
  AsyncStorage, FlatList, ActivityIndicator, Switch, Linking
} from 'react-native';
import { Button, Icon } from 'native-base';
import { Header, Left, Container, Body, Title, Right, Content, Input, Item, Card, DatePicker, Label } from "native-base";
import { userRequestLogout, fetchProfileData, fetchProfileDataForPromise } from "../actions";
import { connect } from "react-redux";
// import { Constants } from 'expo';
import Constants from 'expo-constants'

// import NotificationPopup from 'react-native-push-notification-popup';
// import { messageService, subscriber } from './../stores/messageService';
import Images from './../assets/images/index';

class AccountScreen extends React.Component {

  static navigationOptions = {
    headerShown: false
  };

  constructor() {
    super();
    this.state = {
      switchValue: false
    }
  }

  componentDidMount() {

    // subscriber.subscribe((v) => {
    //   // console.log("data from subscription " + v);
    //   let message = v.data.message;
    //   if (this.popup) {
    //     this.popup.show({
    //       onPress: () => { console.log('Pressed') },
    //       appIconSource: Images.main_icon,
    //       appTitle: 'RoyalTravels',
    //       timeText: 'now',
    //       title: 'Royal Travels',
    //       body: message,
    //       // body: 'This is a sample message.\nTesting emoji 😀',
    //       slideOutTime: 5000
    //     });
    //   }
    // })

    this.props.navigation.addListener('willFocus', (route) => {
      // console.log("tab changed ", route);
      this.setState({ switchValue: false });
      this.props.fetchProfileData(this.props.auth.token.MobileNo1);
    });
  }

  componentWillUnmount() {
    // if (subscriber)
    //   subscriber.unsubscribe();
  }

  render() {
    // console.log("profile Data === " + JSON.stringify(this.props));
    if (this.props.isFetching) {
      return (
        <View style={styles.center}>
          <ActivityIndicator animating={true} />
          {/* <NotificationPopup ref={ref => this.popup = ref} /> */}
        </View>
      )
    }
    // else {  console.log("profile Data === " + JSON.stringify(this.props.profile)); }
    // console.log("profile Data === " + JSON.stringify(this.props.profile));
    let profileData = this.props.profile.profileDataResp.PassengerProfile;
    return (
      <View style={styles.container}>
        {/* <StatusBar translucent={false} /> */}
        {/* <View style={styles.statusBar} /> */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={{ flex: 1 }}>
            <Header
              androidStatusBarColor={"#CA6C39"}
              style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>
              <Body style={styles.headerBody}>
                {/* <Title style={styles.textBody}>Account</Title> */}
              </Body>
            </Header>
            <View style={styles.header}>
              <View style={{ marginLeft: 8, marginRight: 8, marginTop: 3, marginBottom: 250 }}>
              </View>
            </View>
            <TouchableOpacity
              style={{
                alignSelf: 'center', backgroundColor: '#CA6C39',
                position: 'absolute',
                right: 10,
                top: 10
              }}
              onPress={this.onEditProfileClick} >
              <Icon name='md-create' style={{ color: '#ffffff' }} />
            </TouchableOpacity>
            <Image style={styles.avatar} source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }} />
            <View style={styles.body}>
              <Card>
                <View style={styles.bodyContent}>
                  <Text style={styles.name}>{profileData.PassengerName}</Text>
                  <Text style={styles.mobileNumber}>{profileData.MobileNo1}</Text>
                  <Text style={styles.address}>{profileData.PassengerAddress[0].Address}</Text>

                  {/* <TouchableOpacity style={styles.buttonContainer}>
              <Text>Opcion 1</Text>
            </TouchableOpacity> */}
                </View>
              </Card>
              <Card>
                <View style={styles.otherBodyContent}>
                  {/* <Text style={styles.info}>{profileData.CustomerName}</Text>
                  <Text style={styles.description}>{profileData.CustBranchName}</Text> */}
                  <View>
                    <View style={styles.info}>
                      <View style={{ flex: 1.3 }}>
                        <Text> Emp#</Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text> {this.props.auth.token.EmployeeID} </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.info}>
                      <View style={{ flex: 1.3 }}>
                        <Text> Customer's Name </Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text> {profileData.CustomerName} </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.info}>
                      <View style={{ flex: 1.3 }}>
                        <Text> Branch's Name </Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text>{profileData.CustBranchName}</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.info}>
                      <View style={{ flex: 1.3 }}>
                        <Text> Customer's Dept. </Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text>{this.props.auth.token.CustomerDepartment ? this.props.auth.token.CustomerDepartment : '-'}</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.info}>
                      <View style={{ flex: 1.3 }}>
                        <Text> Designation </Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text>{this.props.auth.token.PassengerDesignation ? this.props.auth.token.PassengerDesignation : '-'}</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.info}>
                      <View style={{ flex: 1.3 }}>
                        <Text> Email Id </Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text>{this.props.auth.token.EmailID ? this.props.auth.token.EmailID : '-'}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.info}>
                    <View>
                      <Text style={{ marginStart: 3 }}>Approval Required</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Switch
                        style={{ alignItems: 'flex-end' }}
                        onValueChange={this.toggleSwitch}
                        value={this.state.switchValue}
                        trackColor={{
                          true: "#CA6C39",
                          false: "grey",
                        }}
                        thumbColor={'#f7ae86'}
                      />
                    </View>
                  </View>
                  <View>
                    <View style={styles.info}>
                      <View style={{ flex: 1.3 }}>
                        <Text> Manager Email</Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text>{profileData.ApproverEmail ? profileData.ApproverEmail : '-'}</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.info}>
                      <View style={{ flex: 1.3 }}>
                        <Text> Seceratary Email</Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text>{profileData.SecretaryEmail ? profileData.SecretaryEmail : '-'}</Text>
                      </View>
                    </View>
                  </View>

                </View>
              </Card>
              {/*
              <Card style={styles.callButtonContainer} >
                <TouchableOpacity onPress={this.onCallClick} >
                  <Text style={{ color: '#ffffff', paddingRight: 10, paddingLeft: 10, width: "100%" }}>CALL CUSTOMER CARE</Text>
                </TouchableOpacity>
              </Card>
              */}
              <TouchableOpacity style={styles.buttonContainer} onPress={this._signOutAsync} >
                <Text style={{ color: '#ffffff' }}>LOG OUT</Text>
              </TouchableOpacity>
            </View>
            {/* <Button title="Actually, sign me out :)" onPress={this._signOutAsync} /> */}
          </View>
        </ScrollView>
        {/* <NotificationPopup ref={ref => this.popup = ref} /> */}
      </View>
    );
  }

  onCallClick = async () => {
    // if (this.state.DriverMobileNo) {
    let customerCare = "0123"
    Linking.openURL(`tel:${customerCare}`)
    // }
  };

  toggleSwitch = async (value) => {
    //onValueChange of the switch this function will be called
    this.setState({ switchValue: value });
    if (value) {
      this.props.navigation.navigate('EditProfile', { 'type': "1" });
    }
  };

  onEditProfileClick = async () => {
    this.props.navigation.navigate('EditProfile', { 'type': "2" });
  };

  _signOutAsync = async () => {
    await AsyncStorage.removeItem('ENV');
    this.props.navigation.navigate('Auth');   
    await AsyncStorage.removeItem('emergencyNumber'); 
    this.props.logout();
  };
}

const mapStateToProps = state => ({
  profile: state.profile,
  isFetching: state.profile.isFetching,
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(userRequestLogout()),
  fetchProfileData: (mobileNo) => dispatch(fetchProfileData(mobileNo))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 15,
    backgroundColor: '#eaeaea'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: '#eaeaea'
  },
  headerBody: {
    flex: 0.2
  },
  textBody: {
    alignSelf: "center",
    color: "white"
  },
  header: {
    backgroundColor: "#CA6C39",
    height: 50,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 20
  },
  mobileNumber: {
    fontSize: 15,
    color: "#000000",
    fontWeight: '300',
  },
  address: {
    fontSize: 10,
    color: "#000000",
    fontWeight: '100',
    textAlign: "center"
  },
  body: {
    marginTop: 40,
    marginLeft: 8,
    marginRight: 8
  },
  bodyContent: {
    flex: 1,
    height: 80,
    alignItems: 'center'
  },
  otherBodyContent: {
    height: 360
  },
  name: {
    fontSize: 17,
    color: "#696969",
    fontWeight: "300"
  },
  info: {
    fontSize: 16,
    color: "#000000",
    marginTop: 10,
    paddingBottom: 5,
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 5,
    textAlign: 'center'
  },
  callButtonContainer: {
    marginTop: 10,
    marginBottom: 10,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    width: "100%",
    borderRadius: 30,
    backgroundColor: "#00CC66",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 150,
    borderRadius: 30,
    backgroundColor: "#CA6C39",
  },
  statusBar: {
    backgroundColor: "#A3552A",
    height: Constants.statusBarHeight,
  }
});
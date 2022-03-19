import React from 'react';
import {
  Image, Platform, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator,
  View, StatusBar, AsyncStorage, TouchableNativeFeedback, TouchableHighlight, Switch, Modal,Linking,Text, FlatList, SafeAreaView
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast'
import { WebBrowser, Font } from 'expo';
// import { Ionicons } from '@expo/vector-icons';
// import Slideshow from 'react-native-slideshow';
import DateTimePicker from "react-native-modal-datetime-picker";
import DatePickerIOS from 'react-native-date-picker'

import { MonoText } from '../components/StyledText';
import { connect } from "react-redux";
import {
  fetchVehicleType,fetchVehicleTypeOnly, googleMapAutoComplete1, googleMapAutoComplete2, corpGoogleMapAutoComplete,
  newBooking, resetAutoCompleteFields, fetchCorporateBookingBaseData, fetchCorporateBookingBaseData2,
  updateDisclaimer, getDisclaimer,getTarrifDetails 
} from "../actions";
// import { Constants } from 'expo';
import Constants from 'expo-constants'
import PropTypes from 'prop-types';
import GetLocation from 'react-native-get-location'
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';


// import NotificationPopup from 'react-native-push-notification-popup';
// import { messageService, subscriber } from './../stores/messageService';
import Images from './../assets/images/index';

import {
  Header, Left, Container, Button, Body, Title, Right, Icon, Content, Input, Item,
  Card, DatePicker, Label, Picker
} from "native-base";
import AutoCompleteMap from './AutoCompleteMap';

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  constructor() {
    super();

    

    this.setDate = this.setDate.bind(this);
    this.state = {
      chosenDate: new Date(),
      homeCityId: 0,
      VehicleTypes: [],
      TripTypes: [],
      tripDetailList: [],
      ServiceCities: [],
      PlaceTypes: [{
        PlaceTypesName: '',
        PlaceTypesId: -1
      }],
      isBaseDataFetchInprogress: false,
      modalVisible: false,
      setModalVisible: false,
      switchValue: true,
      switchValue2: false,
      isDateTimePickerVisible: false,
      isDateTimeInstructionVisible: false,
      instructionMessage: "",
      position: 1,
      loc: "",
      data: null,
      chosenDate: new Date(),
      selectedVehicelType: 1,
      isNewBookingInProgress: false,
      fetchAddLocInProgress:false,
      isFetchingPreBooking2Progress: false,
      showTarrifDetails : false,
      isgetTarrifDetailsProgress : false,
      corpSelectedCityId: 1,
      corpSelectedTripId: -1,
      TripDetails: -1,
      corpSelectedVehicelId: -1,
      corpSelectedReportingAtId: -1,
      corpSelectedReportingPlaceId: -1,
      isTrainVisible: false,
      isFlightVisible: true,
      isOthersVisible: false,
      isPickUpAddressAvailable: true,
      showReportingPlace:true,
      corpPickupPlaceAddress: '',
      AddtionalBookingInfo: '',
      Flight_TrainNo: null,
      BoardingPlace: null,
      NoOfPassanger: null,
      tarriffData:null,

      DATA :[{"TripType":"Point-to-Point","TripValue":["-NA-"]},{"TripType":"Airport","TripValue":["Transfer - 1450.00"]},{"TripType":"Local","TripValue":["4 HRS 40KMS - 800.00","8 HRS 80KMS - 1300.00","EXTRA KMS - 14.00","EXTRA HRS - 120.00"]},{"TripType":"Out Station","TripValue":["PER KMS RATE - 12.00","DRIVER BATA - 275.00","DRIVER NIGHT HALT - 300.00","MIN. KMS PER DAY - 250"]}],
      pickupPlaces: [
        {
          PlaceName: '',
          PlaceId: -1
        }
      ],
      results: {
        items: []
      },
      dataSource: [
        {
          title: 'Title 1',
          caption: 'Caption 1',
          url: 'http://placeimg.com/640/482/any',
        }, {
          title: 'Title 2',
          caption: 'Caption 2',
          url: 'http://placeimg.com/640/480/any',
        }, {
          title: 'Title 3',
          caption: 'Caption 3',
          url: 'http://placeimg.com/640/481/any',
        },
      ]
    };
    this.setDate = this.setDate.bind(this);
  }

  

  componentWillUnmount() {
    // if (subscriber)
    //   subscriber.unsubscribe();
  }

  // componentDidMount() {
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
  // }

  onChange(which, value) {
    this.setState({ [which]: value });
    // console.log("----------" + which);
    // console.log("----------" + value);
  };

  setDate(newDate) {

    if (newDate.getTime() - new Date().getTime() <= 3600000) {
      this.setState({
        isDateTimeInstructionVisible: true,
        instructionMessage: `* Booking will be confirmed on availbility because of short notice of less than 1 hour`
      })
    } else {
      this.setState({ isDateTimeInstructionVisible: false });
    }
    // else if (currentTimestamp - date.getTime() > abc2) {
    //   this.setState({ isDateTimeInstructionVisible: true, instructionMessage: 'xyz2' })
    // }

   // this.hideDateTimePicker();
    this.setState({ chosenDate: newDate });
  }

  handler(arg) {
    this.setState({
      loc: arg
    });
    return;
  }


  componentDidMount() {
    this.props.googleMapAutoComplete1();
    this.props.corpGoogleMapAutoComplete();
    this.props.googleMapAutoComplete2();
    this.props.fetchVehicleType();
    Geocoder.init("AIzaSyDSvqFVfMDtPftyvZJMrEYeqF5R5dXc6nE"); 
    // console.log("this.props.auth.token.PassengerId ---" + this.props.auth.token.PassengerId);
    this.fetchBaseData();
    this.props.getDisclaimer(this.props.auth.token.PassengerId).then((data) => {
      // console.log("getDisclaimer ---", data);
      if (!data.DisClaimer) {
        this.setState({ modalVisible: true });
      }
    }).catch((err) => {
    })
  }

  fetchBaseData = async () => {
  
    this.setState({
      isBaseDataFetchInprogress: true,
      PlaceTypes: [{ PlaceTypesName: '', PlaceTypesId: -1 }],
      TripTypes: [{ TripTypeName: '', TripTypeId: -1 }],
      VehicleTypes: [{ VehicleTypeName: '', VehicleTypeId: -1 }],
      pickupPlaces:[{ PlaceName: '',  PlaceId: -1}]
    });
    this.props.fetchCorporateBookingBaseData(this.props.auth.token.PassengerId).then(async(data) => {
      // console.log("----" + JSON.stringify(data));
      this.setState({ isBaseDataFetchInprogress: false });

      if (data.Status == 200) {
        this.setState({
          data: data,
          VehicleTypes: [...this.state.VehicleTypes, ...data.VehicleTypes],
          TripTypes: [...this.state.TripTypes, ...data.TripTypes],
          tripDetailList: [],
          ServiceCities: data.ServiceCities,
          homeCityId: data.CurrentServiceCity,
          PlaceTypes: [...this.state.PlaceTypes, ...data.PlaceTypes],
          corpSelectedCityId: data.CurrentServiceCity == null ? data.ServiceCities[0].CityId : data.CurrentServiceCity,
          customerCareNumber: data.SupportPhone.CustomerCare,
          emergencyNumber: data.SupportPhone.Emergency,
          supportNumber: data.SupportPhone.Support
        });

       // alert(this.state.customerCareNumber)
        await AsyncStorage.setItem('customerCareNumber', this.state.customerCareNumber);
        await AsyncStorage.setItem('emergencyNumber', this.state.emergencyNumber);
        await AsyncStorage.setItem('supportNumber', this.state.supportNumber);
            

       
         
        
      }
       //this.state.PlaceTypes.unshift({"PlaceTypesId":0,"PlaceTypesName":"Select One"});  
     
      this.state.data.TripTypes.forEach(element => {
        console.log(""+JSON.stringify(element));
        this.state.data[element.TripTypeName].unshift({"TripDetailsId":0,"TripDetailsName":"Select One"});
      });
     
   
    }).catch((err) => {
      this.setState({ isBaseDataFetchInprogress: false });
      this.refs.toast.show('Failure');
    })
    
  }

  onAcceptDisclosureClick = async () => {

    let reqBody = {
      // "AppBookingRefId": appBookingRefId,
      "PassengerId": this.props.auth.token.PassengerId,
      "DisClaimer": true,
    }

    // console.log("reqBody ---" + JSON.stringify(reqBody));

    this.setState({
      isNewBookingInProgress: true,
      modalVisible: false
    });
    this.props.updateDisclaimer(reqBody).then((data) => {
      // console.log("----" + JSON.stringify(data));
      this.refs.toast.show(data.Message);
      this.setState({
        isNewBookingInProgress: false
      })
    }).catch((err) => {
      this.setState({
        isNewBookingInProgress: false
      });
      this.refs.toast.show('Failure');
    })

  };


  render() {

    if (this.props.baseData.isFetching) {
      return (
        <View style={styles.center}>
          <ActivityIndicator animating={true} />
          {/* <NotificationPopup ref={ref => this.popup = ref} /> */}
        </View>
      )
    }
    // console.log("this ===" + JSON.stringify(this.props.baseData.corporateBookingBaseData));

    if (!this.props.baseData.location1) {
      this.props.baseData.location1 = {}
      this.props.baseData.location1.address = 'Enter Origin';
    }

    if (!this.props.baseData.location2) {
      this.props.baseData.location2 = {}
      this.props.baseData.location2.address = 'Enter Destination';
    }

    if (!this.props.baseData.location3) {
      this.props.baseData.location3 = {}
      this.props.baseData.location3.address = 'Enter Destination';
    }

    return (
      <View style={styles.container}>
        {(this.state.isNewBookingInProgress || this.state.isFetchingPreBooking2Progress || this.state.isBaseDataFetchInprogress) &&
          <View style={styles.loading}>
            <ActivityIndicator animating={true} size='large' color="black" />
          </View>
        }
        {/* <StatusBar translucent={false} /> */}
        {/* <SpinnerOverlay visible={this.props.loading} /> */}
        <Header
          androidStatusBarColor={"#CA6C39"}
          style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>

         
    
          <Body style={styles.headerBody}>
            <Title style={styles.textBody}>{this.state.switchValue ? 'New Booking' : 'New Booking'}</Title>
          </Body>
          
    

       {/*
            <Button transparent onPress={() => this.callButtonPressed()}>
                 <Icon name='ios-call' type='Ionicons' />
            </Button>
           
       */ }
           <Right>
            <Button transparent onPress={() => this.resetAllFields()}>
              <Icon name='ios-refresh' type='Ionicons' />
            </Button>
            </Right>
          
          
           
          
         
        </Header>
        {/* <View style={styles.toggleButtonStyle}>
          <View style={{ flex: 3 }}>
            <MonoText style={{ fontWeight: "bold" }}>{this.state.switchValue2 ? 'Switch to Official Booking' : 'Switch to Personal Booking'}</MonoText>
          </View>
          <View style={{ flex: 0.6 }}>
            <Switch
              style={{ alignItems: 'flex-end' }}
              onValueChange={this.toggleSwitch}
              value={this.state.switchValue2}
              trackColor={{
                true: "#CA6C39",
                false: "grey",
              }}
              thumbColor={'#f7ae86'}
            />
          </View>
        </View> */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{
            backgroundColor: '#00000080',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{ width: 300, height: 300, backgroundColor: '#fff' }}>
              <View style={{ margin: 10 }}>
                <MonoText style={{ marginTop: 10, fontWeight: 'bold' }}>Disclosure </MonoText>
                <View
                  style={{
                    borderBottomColor: '#CA6C39',
                    borderBottomWidth: 1,
                    marginTop: 20,
                    marginBottom: 20
                  }}
                />
                <MonoText style={{ marginBottom: 10 }}>
                  Your mobile number & email ID will be used for the purpose of sending  SMS & Email of -
                </MonoText>
                <MonoText>
                  1. Booking confirmation,
                </MonoText>
                <MonoText style={{ marginBottom: 10 }}>
                  2. Vehicle Information for the Booking.
                </MonoText>
                <MonoText>
                  I hereby agree to use the email ID & Mobile Number for the above said purpose.
                </MonoText>
              </View>
              <View style={styles.acceptDiscloserViewStyle}>
                <TouchableHighlight
                  style={styles.acceptTouchableButtonStyle}
                  onPress={() => {
                    this.onAcceptDisclosureClick();
                  }}>
                  <MonoText style={{ color: '#ffffff' }}>Accept</MonoText>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <ScrollView contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps={"handled"} ref={(node) => this.scroll = node}>
          {this.state.switchValue && this.state.VehicleTypes && this.state.VehicleTypes.length > 0 &&
            <View>
              <Toast ref="toast" positionValue={-185} opacity={0.8} />
              <View style={{ marginLeft: 8, marginRight: 8, marginTop: 2 }}>
                {/* <Card> */}
                <View style={styles.info}>
                  <View style={{ flex: 1.5, justifyContent: 'center' }}>
                    <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15 }}>City Of Journey</Label>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Picker
                      style={{ marginLeft: 0 }}
                      iosHeader="Select one"
                      mode="dialog"
                      selectedValue={this.state.corpSelectedCityId}
                      onValueChange={this.onValueChange.bind(this, 'corpSelectedCityId')}>
                      {this.state.ServiceCities.map((city) => {
                        return (<Picker.Item style={{ marginLeft: 0 }} label={city.CityName} value={city.CityId} key={city.CityId} />) //if you have a bunch of keys value pair
                      })}
                    </Picker>
                  </View>
                </View>
                {/* </Card> */}
              </View>
              <View style={{ marginLeft: 8, marginRight: 8 }}>
                {/* <Card> */}
                {this.renderCalenderButton()}
                {/* </Card> */}
              </View>
              {this.renderDateTimeInstruction()}
              <View style={{ marginLeft: 8, marginRight: 8 }}>
                {/* <Card> */}
                <View style={styles.info}>
                  <View style={{ flex: 1.5, justifyContent: 'center' }}>
                    <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15, width: "100%" }}>Trip Type</Label>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Picker
                      style={{ marginLeft: 0 }}
                      iosHeader="Select one"
                      mode="dialog"
                      selectedValue={this.state.corpSelectedTripId}
                      onValueChange={this.onValueChange.bind(this, 'corpSelectedTripId')}>
                      {this.state.TripTypes.map((trip) => {
                        return (<Picker.Item style={{ marginLeft: 0 }} label={trip.TripTypeName} value={trip.TripTypeId} key={trip.TripTypeId} />) //if you have a bunch of keys value pair
                      })}
                    </Picker>
                  </View>
                </View>
                {/* </Card> */}
              </View>
              <View style={{ marginLeft: 8, marginRight: 8 }}>
                <View style={styles.info}>
                  <View style={{ flex: 1.5, justifyContent: 'center' }}>
                    <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15, width: "100%" }}>Trip Details</Label>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Picker
                      style={{ marginLeft: 0 }}
                      iosHeader="Select one"
                      mode="dialog"
                      selectedValue={this.state.TripDetails}
                      onValueChange={this.onValueChange.bind(this, 'TripDetails')}>
                      {this.state.tripDetailList.map((trip) => {
                        return (<Picker.Item style={{ marginLeft: 0 }} label={trip.TripDetailsName} value={trip.TripDetailsId} key={trip.TripDetailsId + trip.TripDetailsName} />) //if you have a bunch of keys value pair
                      })}
                    </Picker>
                  </View>
                </View>
              </View>
              <View style={{ marginLeft: 8, marginRight: 8 }}>
                {/* <Card> */}
                <View style={styles.info}>
                  <View style={{ flex: 1.5, justifyContent: 'center' }}>
                    <Label style={{ marginLeft: 10, color: '#5e5e5e', fontWeight: "bold", width: "100%", fontSize: 15 }}>No. Of Passengers</Label>
                  </View>
                  <View style={{ flex: 1.5, marginRight: 8 }}>
                    <Input
                      placeholder="No Of Passengers"
                      name="NoOfPassanger"
                      value={this.state.NoOfPassanger}
                      onChangeText={this.onChange.bind(this, 'NoOfPassanger')}
                    />
                  </View>
                </View>
                {/* </Card> */}
              </View>
              <View style={{ marginLeft: 8, marginRight: 8 }}>
                {/* <Card> */}
                <View style={styles.info}>
                  <View style={{ flex: 1.5, justifyContent: 'center' }}>
                    <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15, width: "100%" }}>Vehicle Type</Label>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Picker
                      style={{ marginLeft: 0 }}
                      iosHeader="Select one"
                      mode="dialog"
                      selectedValue={this.state.corpSelectedVehicelId}
                      onValueChange={this.onValueChange.bind(this, 'corpSelectedVehicelId')}>
                      {this.state.VehicleTypes.map((vehicle) => {
                        return (<Picker.Item style={{ marginLeft: 0 }} label={vehicle.VehicleTypeName} value={vehicle.VehicleTypeId} key={vehicle.VehicleTypeId} />) //if you have a bunch of keys value pair
                      })}
                    </Picker>
                  </View>
                </View>
                {/* </Card> */}
              </View>
              <View style={{ marginLeft: 8, marginRight: 8 }}>
                {/* <Card> */}
                {(this.state.fetchAddLocInProgress ) &&
                <View style={styles.loading}>
                <ActivityIndicator animating={true} size='large' color="black" />
                </View>
        }
                <View style={styles.info}>
                  <View style={{ flex: 1.5, justifyContent: 'center' }}>
                    <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15, width: "100%" }}>Reporting At</Label>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Picker
                      style={{ marginLeft: 0 }}
                      iosHeader="Select one"
                      mode="dialog"
                      selectedValue={this.state.corpSelectedReportingAtId}
                      onValueChange={this.onValueChange.bind(this, 'corpSelectedReportingAtId')}>
                      {this.state.PlaceTypes.map((place) => {
                        return (<Picker.Item style={{ marginLeft: 0 }} label={place.PlaceTypesName} value={place.PlaceTypesId} key={place.PlaceTypesId} />) //if you have a bunch of keys value pair
                      })}
                    </Picker>
                  </View>
                </View>
                {/* </Card> */}
              </View>
              {this.renderReportingPlace()}
              {this.renderReportingAddress()}
              {this.renderTrainOrFlightText()} 
              
           
              <View style={{ marginLeft: 8, marginRight: 8 }}>
                {/* <Card> */}
                <View style={styles.info}>
                  <View style={{ flex: 1.5, justifyContent: 'center' }}>
                    <Label style={{ marginLeft: 10, color: '#5e5e5e', fontWeight: "bold", width: "100%" }}>Comment</Label>
                  </View>
                  <View style={{ flex: 1.5, marginRight: 8 }}>
                    <Input
                      placeholder="Comment / To Address"
                      name="AddtionalBookingInfo"
                      value={this.state.AddtionalBookingInfo}
                      onChangeText={this.onChange.bind(this, 'AddtionalBookingInfo')}
                    />
                  </View>
                </View>
                {/* </Card> */}
              </View>
              <View style={{ marginLeft: 8, marginRight: 8 }}>
                <MonoText style={{ fontSize: 12, marginLeft: 5, color: '#707070' }}>* Mobile Number & EmailId will be used for booking of this trip only.</MonoText>
              </View>
              <View style={{ marginLeft: 8, marginRight: 8, marginTop: 3, marginBottom: 250 }}>
                <Button rounded style={{
                  alignSelf: 'center', backgroundColor: '#CA6C39', shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowOpacity: 1,
                  elevation: 6,
                  shadowRadius: 15,
                  shadowOffset: { width: 1, height: 13 },
                }} onPress={this.onBookButtonClick2} >
                  <Icon name='arrow-forward' />
                </Button>


               

                 <TouchableHighlight>
                            <View style={styles.tariffButton}>
                              <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '900', flex: 1 , fontWeight: "bold" }}>TARIFF</Text>
                            </View>
                  </TouchableHighlight>

              { this.renderTarrif() }   

              <View style={styles.container}>  
                        {(this.state.isgetTarrifDetailsProgress ) &&
                          <View style={styles.loading}>
                          <ActivityIndicator animating={true} size='large' color="black" />
                          </View>
                      }
               </View>

                <View>
                  <Card style={styles.tariffContainer} >
                    <TouchableOpacity onPress={this.callButtonPressed} >
                      <Text style={{ color: '#ffffff', paddingRight: 10, paddingLeft: 10, width: "100%" }}>CALL CUSTOMER CARE</Text>
                    </TouchableOpacity>
                  </Card>
                 </View>
                </View> 

                            
              
             
              {/*  <ScrollView horizontal={true} contentContainerStyle={styles.contentContainerHorzSlider} showsHorizontalScrollIndicator={false}>
                <Card>
                  <Image
                    source={
                      require('../assets/images/images.jpg')
                    }
                    style={styles.welcomeImage}
                  />
                </Card>
                <Card>
                  <Image
                    source={
                      require('../assets/images/imagess.jpg')
                    }
                    style={styles.welcomeImage}
                  />
                </Card>
                <Card>
                  <Image
                    source={
                      require('../assets/images/imagesss.jpg')
                    }
                    style={styles.welcomeImage}
                  />
                </Card>
              </ScrollView> */}
              {/* <NotificationPopup ref={ref => this.popup = ref} /> */}
            </View>
          }
          {!this.state.switchValue &&
            <View>
              <View style={{ flex: 1, marginBottom: 8 }} >
                <Toast ref="toast" positionValue={400} opacity={0.8} />
                {/* <View>
                      <AutoCompleteMap handler={this.handler.bind(this)} />
                    </View> */}
                {/* <View style={styles.welcomeContainer}>
                <Image
                 source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
                }
                style={styles.welcomeImage}
                />
                </View> */}

                {/*  <Slideshow
                      dataSource={this.state.dataSource}
                      position={this.state.position}
                      onPositionChanged={position => this.setState({ position })} /> */}
                <View style={{ marginLeft: 8, marginRight: 8, marginTop: 3 }}>
                  <Card>
                    {this.renderPickUpAddressPlatform()}
                    {/* <Item stackedLabel>
                    <Label style={{ marginLeft: 6, fontWeight: "bold" }}>PickUp Address</Label>
                    <Input placeholder="Enter Origin" />
                  </Item> */}
                    {/*  <Item stackedLabel>
                  <Label style={{ marginLeft: 6, fontWeight: "bold" }}>PickUp Landmark</Label>
                  <Input placeholder="Enter PickUp Landmark" />
                </Item> */}
                    {/* <View style={{ marginTop: 6, marginRight: 10 }}>
                  <Label style={{ marginLeft: 6, fontWeight: "bold", color: '#5e5e5e', fontSize: 15 }}>Select PickUp Place Type</Label>
                  <Picker
                    style={{ marginLeft: 0 }}
                    iosHeader="Select one"
                    mode="dialog"
                    selectedValue={this.state.selected1}
                    onValueChange={this.onValueChange.bind(this)}>
                    {this.props.baseData.placeTypesList.map((vehicle) => {
                      return (<Picker.Item style={{ marginLeft: 0 }} label={vehicle.PlaceTypesName} value={vehicle.PlaceTypesId} key={vehicle.PlaceTypesId} />)
                    })}
                  </Picker>
                </View> */}
                  </Card>
                </View>

                <View style={{ marginLeft: 8, marginRight: 8, marginTop: 0 }}>
                  <Card>
                    {this.renderDropAddressPlatform()}
                    {/*  <Item stackedLabel>
                  <Label style={{ marginLeft: 6, fontWeight: "bold" }}>Drop Address</Label>
                  <Input placeholder="Enter Destination" />
                </Item> */}
                    {/*  <View style={{ marginTop: 6, marginRight: 10 }}>
                  <Label style={{ marginLeft: 6, fontWeight: "bold", color: '#5e5e5e', fontSize: 15 }}>Select Drop Place Type</Label>
                  <Picker
                    style={{ marginLeft: 0 }}
                    iosHeader="Select one"
                    mode="dialog"
                    selectedValue={this.state.selected1}
                    onValueChange={this.onValueChange.bind(this)}>
                    {this.props.baseData.placeTypesList.map((vehicle) => {
                      return (<Picker.Item style={{ marginLeft: 0 }} label={vehicle.PlaceTypesName} value={vehicle.PlaceTypesId} key={vehicle.PlaceTypesId} />)
                    })}
                  </Picker>
                </View> */}
                  </Card>
                </View>

               

               

                <View style={{ marginLeft: 8, marginRight: 8 }}>
                  <Card>
                    {this.renderCalenderButton()}
                  </Card>
                  
                  {/* <MonoText>
              Date: {this.state.chosenDate.toString().substr(4, 12)}
            </MonoText> */}
                </View>

                <View style={{ marginLeft: 8, marginRight: 8 }}>
                  <Card>
                    <View style={{ marginTop: 10, marginRight: 10 }}>
                      <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15, width: "100%" }}>Select Vehicle Type</Label>
                      <Picker
                        style={{ marginLeft: 0 }}
                        iosHeader="Select one"
                        mode="dialog"
                        selectedValue={this.state.selectedVehicelType}
                        onValueChange={this.onValueChange.bind(this, 'selectedVehicelType')}>
                        {this.props.baseData.vehicleTypesList.map((vehicle) => {
                          return (<Picker.Item style={{ marginLeft: 0 }} label={vehicle.VehicleTypeName} value={vehicle.VehicleTypeId} key={vehicle.VehicleTypeId} />) //if you have a bunch of keys value pair
                        })}
                      </Picker>
                    </View>
                  </Card>
                </View>

               

                <View style={{ marginLeft: 8, marginRight: 8, marginTop: 3, marginBottom: 250 }}>
                  {/* <Card rounded> */}
                  <Button rounded style={{
                    alignSelf: 'center', backgroundColor: '#CA6C39', shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowOpacity: 1,
                    elevation: 6,
                    shadowRadius: 15,
                    shadowOffset: { width: 1, height: 13 },
                  }} onPress={this.onBookButtonClick} >
                    <Icon name='arrow-forward' />
                  </Button>
                  {/* </Card> */}
                </View>

                {/* <Button onPress={this.clearAsyncStorage}>
            <MonoText>Clear Async Storage</MonoText>
          </Button> */}
                {/*  <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

            <MonoText style={styles.getStartedText}>Get started by opening</MonoText>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
            </View>

            <MonoText style={styles.getStartedText}>
              Change this text and your app will automatically reload.
            </MonoText>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <MonoText style={styles.helpLinkText}>Help, it didn’t automatically reload!</MonoText>
            </TouchableOpacity>
          </View> */}
              </View>
              {/*  <ScrollView horizontal={true} contentContainerStyle={styles.contentContainerHorzSlider} showsHorizontalScrollIndicator={false}>
                <Card>
                  <Image
                    source={
                      require('../assets/images/images.jpg')
                    }
                    style={styles.welcomeImage}
                  />
                </Card>
                <Card>
                  <Image
                    source={
                      require('../assets/images/imagess.jpg')
                    }
                    style={styles.welcomeImage}
                  />
                </Card>
                <Card>
                  <Image
                    source={
                      require('../assets/images/imagesss.jpg')
                    }
                    style={styles.welcomeImage}
                  />
                </Card>
              </ScrollView> */}
              {/* <NotificationPopup ref={ref => this.popup = ref} /> */}
            </View>
          }
        </ScrollView>

        {/* <View style={styles.tabBarInfoContainer}>
          <MonoText style={styles.tabBarInfoText}>This is a tab bar Yes !!!!!! kundan. You can edit it in:</MonoText>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View> */}
        {/* <NotificationPopup ref={ref => this.popup = ref} /> */}
      </View >
    );
  }

  onCallClick = async () => {
    let customerCareNumber =  await AsyncStorage.getItem('customerCareNumber');
   
     if (customerCareNumber) {
       Linking.openURL(`tel:${customerCareNumber}`)
     }
  };



  renderPickUpAddressPlatform = () => {

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple('#CA6C39')}
          onPress={this.onSourceClick}
          underlayColor='#fff'>
          <View style={styles.loginScreenButton}>
            <MonoText style={styles.addressLabel}>PickUp Address</MonoText>
            <MonoText style={styles.originText}>{this.props.baseData.location1.address}</MonoText>
          </View>
        </TouchableNativeFeedback>
      )
    } else {
      return (
        <TouchableHighlight
          onPress={this.onSourceClick}
          underlayColor='#fff'>
          <View style={styles.loginScreenButton}>
            <MonoText style={styles.addressLabel}>PickUp Address</MonoText>
            <MonoText style={styles.originText}>{this.props.baseData.location1.address}</MonoText>
          </View>
        </TouchableHighlight>
      )
    }
  }


  renderDropAddressPlatform = () => {

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple('#CA6C39')}
          onPress={this.onDestinationClick}
          underlayColor='#fff'>
          <View style={styles.loginScreenButton}>
            <MonoText style={styles.addressLabel}>Drop Address</MonoText>
            <MonoText style={styles.originText}>{this.props.baseData.location2.address}</MonoText>
          </View>
        </TouchableNativeFeedback>
      )
    } else {
      return (
        <TouchableHighlight
          onPress={this.onDestinationClick}
          underlayColor='#fff'>
          <View style={styles.loginScreenButton}>
            <MonoText style={styles.addressLabel}>Drop Address</MonoText>
            <MonoText style={styles.originText}>{this.props.baseData.location2.address}</MonoText>
          </View>
        </TouchableHighlight>
      )
    }
  }
  renderTrainOrFlightText() {
    if (this.state.isTrainVisible) {
      return (
        <View>
          <View style={{ marginLeft: 8, marginRight: 8 }}>
            {/* <Card> */}
            <View style={styles.info}>
              <View style={{ flex: 1.5, justifyContent: 'center' }}>
                <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15, width: "100%" }}>Train No</Label>
              </View>
              <View style={{ flex: 1.5, marginRight: 8 }}>
                <Input
                  placeholder="Train #"
                  name="Flight_TrainNo"
                  value={this.state.Flight_TrainNo}
                  onChangeText={this.onChange.bind(this, 'Flight_TrainNo')}
                />
              </View>
            </View>
            {/* </Card> */}
          </View>
          <View style={{ marginLeft: 8, marginRight: 8 }}>
            {/* <Card> */}
            <View style={styles.info}>
              <View style={{ flex: 1.5, justifyContent: 'center' }}>
                <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15, width: "100%" }}>Boarding Place</Label>
              </View>
              <View style={{ flex: 1.5, marginRight: 8 }}>
                <Input
                  placeholder="Enter Boarding Place"
                  name="BoardingPlace"
                  value={this.state.BoardingPlace}
                  onChangeText={this.onChange.bind(this, 'BoardingPlace')}
                />
              </View>
            </View>
            {/* </Card> */}
          </View>
        </View>
      )
    } else if (this.state.isFlightVisible) {
      return (
        <View>
          <View style={{ marginLeft: 8, marginRight: 8 }}>
            {/* <Card> */}
            <View style={styles.info}>
              <View style={{ flex: 1.5, justifyContent: 'center' }}>
                <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15, width: "100%" }}>Flight No</Label>
              </View>
              <View style={{ flex: 1.5, marginRight: 8 }}>
                <Input
                  placeholder="Flight #"
                  name="Flight_TrainNo"
                  value={this.state.Flight_TrainNo}
                  onChangeText={this.onChange.bind(this, 'Flight_TrainNo')}
                />
              </View>
            </View>
            {/* </Card> */}
          </View>
          <View style={{ marginLeft: 8, marginRight: 8 }}>
            {/* <Card> */}
            <View style={styles.info}>
              <View style={{ flex: 1.5, justifyContent: 'center' }}>
                <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15, width: "100%" }}>Boarding Place</Label>
              </View>
              <View style={{ flex: 1.5, marginRight: 8 }}>
                <Input
                  placeholder="Enter Boarding Place"
                  name="BoardingPlace"
                  value={this.state.BoardingPlace}
                  onChangeText={this.onChange.bind(this, 'BoardingPlace')}
                />
              </View>
            </View>
            {/* </Card> */}
          </View>
        </View>
      )
    }
  }

  renderDateTimeInstruction() {

    // this.setState({ modalVisible: true });

    if (this.state.isDateTimeInstructionVisible) {
      return (
        <View style={{ marginLeft: 8, marginRight: 8 }}>
          <MonoText style={{ fontSize: 12, marginLeft: 5, color: '#707070' }}>{this.state.instructionMessage}</MonoText>
        </View>
      )
    }
  }

  renderReportingPlace() {

    if (this.state.corpSelectedReportingAtId != -1 && this.state.showReportingPlace == true  ) {
      return (
        <View style={{ marginLeft: 8, marginRight: 8 }}>
          {/* <Card> */}
          <View style={styles.info}>
            <View style={{ flex: 1.5, justifyContent: 'center' }}>
              <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', fontSize: 15, width: "100%" }}>Reporting Place</Label>
            </View>
            <View style={{ flex: 1.5 }}>
              <Picker
                style={{ marginLeft: 0 }}
                iosHeader="Select one"
                mode="dialog"
                selectedValue={this.state.corpSelectedReportingPlaceId}
                onValueChange={this.onValueChange.bind(this, 'corpSelectedReportingPlaceId')}>
                {this.state.pickupPlaces.map((place) => {
                  return (<Picker.Item style={{ marginLeft: 0 }} label={place.PlaceName} value={place.PlaceId} key={place.PlaceId} />) //if you have a bunch of keys value pair
                })}
              </Picker>
            </View>
          </View>
          {/* </Card> */}
        </View>
      )
    }
  }

  renderReportingAddress() {
    // console.log("this.props.baseData.location3 ---->>>" + JSON.stringify(this.props.baseData.location3));

    // if (!this.props.baseData.location3 && this.props.baseData.location3.address == '') {
    //   this.props.baseData.location3 = {}
    //   this.props.baseData.location3.address = 'Enter Reporting Address';
    // }
    
    

    if (this.state.isPickUpAddressAvailable) {
      return (
        <View style={{ marginLeft: 8, marginRight: 8 }}>
          {/* <Card> */}
          <View style={styles.info}>
            <View style={{ flex: 1.5, justifyContent: 'center' }}>
              <Label style={{ marginLeft: 10, fontWeight: "bold", color: '#5e5e5e', width: "100%", fontSize: 15 }}>Reporting Address</Label>
            </View>
            <View style={{ flex: 1.5, marginRight: 8 }}>
              <Input
                placeholder="Enter Reporting Address"
                name="corpPickupPlaceAddress"
                value={this.state.corpPickupPlaceAddress}
                onChangeText={this.onChange.bind(this, 'corpPickupPlaceAddress')}
              />
            </View>
          </View>
          {/* </Card> */}
        </View>
      )
    } else {
      return (
        <View style={{ marginLeft: 8, marginRight: 8, marginTop: 3 }}>
          <Card>
            {this.renderReortingAddressPlatform()}
          </Card>
        </View>
      )
    }
  }


  renderReortingAddressPlatform = () => {

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple('#CA6C39')}
          onPress={this.onCorpPickUpAddressClick}
          underlayColor='#fff'>
          <View style={styles.loginScreenButton}>
            <MonoText style={styles.addressLabel}>PickUp Address</MonoText>
            <MonoText style={styles.originText}>{this.props.baseData.location3.address}</MonoText>
          </View>
        </TouchableNativeFeedback>
      )
    } else {
      return (
        <TouchableHighlight
          onPress={this.onCorpPickUpAddressClick}
          underlayColor='#fff'>
          <View style={styles.loginScreenButton}>
            <MonoText style={styles.addressLabel}>PickUp Address</MonoText>
            <MonoText style={styles.originText}>{this.props.baseData.location3.address}</MonoText>
          </View>
        </TouchableHighlight>
      )
    }
  }

  onSourceClick = async () => {
    this.props.navigation.navigate('AutoCompleteMap', { 'type': 0 });
  };

  onDestinationClick = async () => {
    this.props.navigation.navigate('AutoCompleteMap', { 'type': 1 });
  };

  onCorpPickUpAddressClick = async () => {
    this.props.navigation.navigate('AutoCompleteMap', { 'type': 2 });
  };

  toggleSwitch = value => {
    //onValueChange of the switch this function will be called
    this.setState({ switchValue2: value });
    //state changes according to switch
    //which will result in re-render the text
  };

  

    

   renderItemTarif = ({ item }) => { 
    let backgroundColor = "#ffff" ;

    ItemTag = ({ item, style }) => (
   
      <TouchableOpacity style={[styles.itemTariff, style]}>
        <Text style={styles.titleTariff}>{item.TripType}</Text>
            <TouchableOpacity style={[styles.subItemTariff, style]}>
    
            {item.TripValue.map((prop, key) => { 
             return (
                <Text style={styles.subTitleTariff}>{prop}</Text>
             );
          })}
    
            </TouchableOpacity>
      </TouchableOpacity>
    );

    return (
      <ItemTag
        item={item}
        style={{ backgroundColor }} 
      />
    );
  };

  renderTarrif(){
    return (
      <SafeAreaView style={styles.containerTariff}>
        <FlatList
          data={this.state.tarriffData}
          renderItem={this.renderItemTarif}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    );

  }  

  renderCalenderButton() {

    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback onPress={this.showDateTimePicker} background={TouchableNativeFeedback.Ripple('#CA6C39')}>
          <View style={styles.info}>
            <View style={{ flex: 1.5, justifyContent: 'center' }}>
              <Label style={{ fontSize: 15, color: '#5e5e5e', marginLeft: 8, fontWeight: "bold", width: "100%" }}>Date & Time</Label>
            </View>
            <View style={{ flex: 1.5 }}>
              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                <Icon name='calendar' style={{ fontSize: 20, color: '#000000', marginTop: 5 }} />
                <MonoText style={{ fontSize: 20, color: '#000000', marginLeft: 8, paddingBottom: 5 }}>{this.state.chosenDate.getDate()}</MonoText>
                <View style={{ flexDirection: 'column', marginLeft: 5, paddingTop: 3 }}>
                  <MonoText style={{ fontSize: 8, color: '#000000', marginLeft: 5 }}>{days[this.state.chosenDate.getDay()]}</MonoText>
                  <MonoText style={{ fontSize: 8, color: '#000000', marginLeft: 5 }}>{months[this.state.chosenDate.getMonth()]}</MonoText>
                </View>
                <MonoText style={{ fontSize: 20, color: '#000000', marginLeft: 8 }}>{this.formatAMPM(this.state.chosenDate)}</MonoText>
              </View>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
                mode={'datetime'}
                is24Hour={true}
              />
            </View>
          </View>
        </TouchableNativeFeedback>
      )
    } else {
      return (
        <TouchableHighlight onPress={this.showDateTimePicker} >
          <View style={{ margin: 10 }}>
            <Label style={{ fontSize: 15, color: '#5e5e5e', fontWeight: "bold", width: "100%" }}>Journey Date And Time</Label>
           < TouchableHighlight onPress={this.closeDateCalender} >
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
                                    <Text style={{ color: 'blue', fontWeight: "bold" , color: '#CA6C39' }}> Done </Text> 
                                </View>
            </TouchableHighlight>                    

            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Icon name='calendar' style={{ fontSize: 30, color: '#000000' }} />
              <MonoText style={{ fontSize: 25, color: '#000000', marginLeft: 8, paddingBottom: 5 }}>{this.state.chosenDate.getDate()}</MonoText>
              <View style={{ flexDirection: 'column', marginLeft: 5, paddingTop: 3 }}>
                <MonoText style={{ fontSize: 10, color: '#000000', marginLeft: 5 }}>{days[this.state.chosenDate.getDay()]}</MonoText>
                <MonoText style={{ fontSize: 10, color: '#000000', marginLeft: 5 }}>{months[this.state.chosenDate.getMonth()]}</MonoText>
              </View>
              <MonoText style={{ fontSize: 25, color: '#000000', marginLeft: 8 }}>{this.formatAMPM(this.state.chosenDate)}</MonoText>
            </View>
            {this.state.isDateTimePickerVisible && (
             <DatePickerIOS
              
                date={this.state.chosenDate}
                onDateChange={this.setDate}
                mode={'datetime'}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                
            /> )} 
          </View>
        </TouchableHighlight>
      )
    }

  }

  formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <MonoText onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </MonoText>
      );

      return (
        <MonoText style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </MonoText>
      );
    } else {
      return (
        <MonoText style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </MonoText>
      );
    }
  }
  // selectedVehicelType: value

  onValueChange(which, value) {
       console.log("which lat -----", which);
       console.log("value lat -----", value);
    //|| which == 'corpSelectedReportingPlaceId'
    if (which == 'corpSelectedReportingAtId') {
      if (value == -1) {
        this.setState({ corpSelectedReportingAtId: -1 })
      } else if (this.state.corpSelectedTripId == -1 || this.state.corpSelectedVehicelId == -1) {
        alert('Please Select Trip Type & Vehicle Type First');
        return;
      }
    }

    this.setState({
      [which]: value
     
    }, () => {

      if (which == 'corpSelectedTripId') {

        let trip = null;
        this.state.TripTypes.forEach(element => {
          if (element.TripTypeId == this.state.corpSelectedTripId) {
            trip = element;
          }
        });
        // console.log("----", trip.TripTypeName);
        // console.log("--2222--", this.state.data[trip.TripTypeName]);
       // let tripDetailListLocal = this.state.data[trip.TripTypeName].unshift({"TripDetailsId":0,"TripDetailsName":" Select One "});
       // console.log(" tripDetailListLocal -- ",this.state.data[trip.TripTypeName]);
        this.setState({
          tripDetailList: this.state.data[trip.TripTypeName],
          TripDetails: -1,
          TripDetailsId: 0,
          isDateTimePickerVisible: false
        })  
        
      }

      if(which == 'TripDetails'){
        this.setState({
              TripDetailsId: value
        })
      }

      if (which == 'corpSelectedCityId') {
        this.setState({ corpSelectedReportingPlaceId: -1 })
      }

     // if (which == 'corpSelectedReportingAtId' || which == 'corpSelectedCityId' && which != 'selectedVehicelType' ) {
      if (which == 'corpSelectedCityId' ) {
       
        this.callPreBooking2();
        //this.resetAllFields();
      }
      if( which == 'corpSelectedReportingAtId'){
        this.loadReportingPLaces()
      }

      if (which == 'corpSelectedReportingPlaceId' ) {
        this.callPreBooking3();
      }

      if(which == 'corpSelectedVehicelId'){

        this.getTarrifDetails();

      }

      if (which == 'corpSelectedReportingAtId') {


        if (value == 1) {
          this.setState({
            isFlightVisible: true,
            isTrainVisible: false,
            isOthersVisible: false,
            isPickUpAddressAvailable: true,
            showReportingPlace:true
          })
        } else if (value == 2) {
          this.setState({
            isFlightVisible: false,
            isTrainVisible: true,
            isOthersVisible: false,
            isPickUpAddressAvailable: true,
            showReportingPlace:true
          })
        } else if (value == 10) {
        
          this.setState({
            isFlightVisible: false,
            isTrainVisible: false,
            isOthersVisible: true,
            isPickUpAddressAvailable: false,
            showReportingPlace: false
            
          })
        }else if (value == 99) {

          this.setState({
            isFlightVisible: false,
            isTrainVisible: false,
            isOthersVisible: true,
            isPickUpAddressAvailable: false,
            showReportingPlace: false
          }) 
          this.setState({
          fetchAddLocInProgress : true });
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 150000,
        }).then(location => {
                this.setState({
                    location,
                    loading: false,
                });
        
         Geocoder.from(location.latitude, location.longitude)
          .then(json => {
              var addressComponent = json.results[0];
              this.setState({ corpPickupPlaceAddress: addressComponent.formatted_address,
                    isPickUpAddressAvailable: true,
                    showReportingPlace: false,
                    fetchAddLocInProgress : false
                });
          })
          .catch(error => console.warn(error));
                console.log(JSON.stringify(location));
            })
            .catch(ex => {
                const { code, message } = ex;
                console.warn(code, message);
                if (code === 'CANCELLED') {
                    Alert.alert('Location cancelled by user or by another request');
                }
                if (code === 'UNAVAILABLE') {
                    Alert.alert('Location service is disabled or unavailable');
                }
                if (code === 'TIMEOUT') {
                    Alert.alert('Location request timed out');
                }
                if (code === 'UNAUTHORIZED') {
                    Alert.alert('Authorization denied');
                }
                this.setState({
                    location: null,
                    loading: false,
                });
            });
        } else {
          this.setState({
            isFlightVisible: false,
            isTrainVisible: false,
            isOthersVisible: true,
            isPickUpAddressAvailable: true
          })
        }
      }
    });
  }


  callPreBooking2 = async () => {

    this.setState({   
      corpSelectedTripId: -1,
      TripDetails: -1,
      corpSelectedVehicelId: -1,
      corpSelectedReportingAtId: -1,
      corpSelectedReportingPlaceId: -1,
      isPickUpAddressAvailable: true,
      showReportingPlace:true,
      NoOfPassanger: null,
     corpPickupPlaceAddress:null,
     isTrainVisible: false,
     isFlightVisible: true,
     isOthersVisible: false,
     Flight_TrainNo: null,
     BoardingPlace: null,
     AddtionalBookingInfo: '',
     instructionMessage: '',
     isDateTimeInstructionVisible: false
     });
  

    let journeyDate = this.state.chosenDate.getFullYear() + "-" + (this.state.chosenDate.getMonth() + 1) + "-" + this.state.chosenDate.getDate()
    let journeyTime = this.state.chosenDate.toTimeString().split(' ')[0]
    let reqBody = {
      "CustomerId": this.props.auth.token.CustomerId,
      "PassengerId": this.props.auth.token.PassengerId,
      "JourneyDate": journeyDate,
      "JourneyTime": journeyTime,
      "ServiceCityId": this.state.corpSelectedCityId,
      "TripTypeId": this.state.corpSelectedTripId,
      "TripDetails": this.state.TripDetails,
      "VehicleTypeId": this.state.corpSelectedVehicelId,
      "PickupPlaceTypeId": this.state.corpSelectedReportingAtId 
    }

   // console.log("reqBody" + JSON.stringify(reqBody));
     this.setState({ isFetchingPreBooking2Progress: true });
    
     this.props.fetchVehicleTypeOnly(this.props.auth.token.CustomerId,this.props.auth.token.PassengerId,this.state.corpSelectedCityId).then((data) => {
   
      this.setState({
        VehicleTypes:[]
       });

          //console.log(data.VehicleTypes) 
          data.VehicleTypes.unshift({"VehicleTypeId":0,"VehicleTypeName":"Select One"});
        //   {this.state.PlaceTypes.map((place) => {
        //    return (<Picker.Item style={{ marginLeft: 0 }} label={place.PlaceTypesName} value={place.PlaceTypesId} key={place.PlaceTypesId} />) //if you have a bunch of keys value pair
          this.setState({
                      VehicleTypes: data.VehicleTypes });

           this.setState({
            isFetchingPreBooking2Progress: false,
           // pickupPlaces: data.pickupPlaces,
           // corpPickupPlaceAddress: data.preBookingDetails.PickupPlaceAddress
           // corpPickupPlaceAddress: ''
          });
           }); 
           
    
  };

  loadReportingPLaces = async () =>{

    let journeyDate = this.state.chosenDate.getFullYear() + "-" + (this.state.chosenDate.getMonth() + 1) + "-" + this.state.chosenDate.getDate()
    let journeyTime = this.state.chosenDate.toTimeString().split(' ')[0]
    let reqBody = {
      "CustomerId": this.props.auth.token.CustomerId,
      "PassengerId": this.props.auth.token.PassengerId,
      "JourneyDate": journeyDate,
      "JourneyTime": journeyTime,
      "ServiceCityId": this.state.corpSelectedCityId,
      "TripTypeId": this.state.corpSelectedTripId,
      "TripDetails": this.state.TripDetails,
      "VehicleTypeId": this.state.corpSelectedVehicelId,
      "PickupPlaceTypeId": this.state.corpSelectedReportingAtId 
    }


    this.props.fetchCorporateBookingBaseData2(reqBody).then((data) => {
      
       this.setState({
         pickupPlaces: [
           {
             PlaceName: '',
             PlaceId: -1
           }
         ],
         corpSelectedReportingPlaceId: -1,
         corpPickupPlaceAddress: '',
         isFetchingPreBooking2Progress: false
       });
       if (data.Status == 200) {
         if (data.preBookingDetails && data.preBookingDetails.PickupPlaceAddress) {
             data.pickupPlaces.unshift({"PlaceId":0,"PlaceName":"Select One"});
            
           this.setState({
             isFetchingPreBooking2Progress: false,
             pickupPlaces: data.pickupPlaces,
            // corpPickupPlaceAddress: data.preBookingDetails.PickupPlaceAddress
            // corpPickupPlaceAddress: ''
           });
          
         } else {
           data.pickupPlaces.unshift({"PlaceId":0,"PlaceName":"Select One"});
           this.setState({
             isFetchingPreBooking2Progress: false,
             pickupPlaces: data.pickupPlaces,
             corpPickupPlaceAddress: ''
           });
         }
       }
     }).catch((err) => {
       this.setState({ isFetchingPreBooking2Progress: false });
       this.refs.toast.show('Failure');
     })


  }


  getTarrifDetails = async () => {
    console.log(" call Get Tarrif Details ");
    
   //  http://app.royaltour.in:8090/api/CustomerApp/ViewTariff?custId=17&ServiceCityId=412&VehicleTypeId=26

    let custId = this.props.auth.token.CustomerId
    let ServiceCityId = this.state.corpSelectedCityId
    let VehicleTypeId = this.state.corpSelectedVehicelId

   

    // console.log("reqBody" + JSON.stringify(reqBody));
    this.setState({ isgetTarrifDetailsProgress: true });

    this.props.getTarrifDetails(custId,ServiceCityId,VehicleTypeId).then((data) => {
       console.log("getTarrifDetails" + JSON.stringify(data));
      if (data.status == 200 || data.status == 400) {
         
           this.setState({
            isgetTarrifDetailsProgress: false,
            showTarrifDetails : true,  
            tarriffData : data.TariffLists
            })

        } else {
          this.setState({
                    isgetTarrifDetailsProgress: false,
                    showTarrifDetails : true 
          });

        }
      
    }).catch((err) => {
      this.setState({ isFetchingPreBooking2Progress: false });
      this.refs.toast.show('Failure');
    })

  };


  callPreBooking3 = async () => {
    console.log(" call Pre Booking 3 ");
    let journeyDate = this.state.chosenDate.getFullYear() + "-" + (this.state.chosenDate.getMonth() + 1) + "-" + this.state.chosenDate.getDate()
    let journeyTime = this.state.chosenDate.toTimeString().split(' ')[0]
    let reqBody = {
      "CustomerId": this.props.auth.token.CustomerId,
      "PassengerId": this.props.auth.token.PassengerId,
      "JourneyDate": journeyDate,
      "JourneyTime": journeyTime,
      "ServiceCityId": this.state.corpSelectedCityId,
      "TripTypeId": this.state.corpSelectedTripId,
      "TripDetails": this.state.TripDetails,
      "VehicleTypeId": this.state.corpSelectedVehicelId,
      "PickupPlaceTypeId": this.state.corpSelectedReportingAtId,
      "PickupPlaceId": this.state.corpSelectedReportingPlaceId
    }

    // console.log("reqBody" + JSON.stringify(reqBody));
    this.setState({ isFetchingPreBooking2Progress: true });
    this.props.fetchCorporateBookingBaseData2(reqBody).then((data) => {
       //console.log("Response Body -- callPreBooking3" + JSON.stringify(data));
      if (data.Status == 200) {
        if (data.preBookingDetails && data.preBookingDetails.PickupPlaceAddress) {
          this.setState({
            isFetchingPreBooking2Progress: false,
            corpPickupPlaceAddress: data.preBookingDetails.PickupPlaceAddress
          });

        } else {
          this.setState({
            isFetchingPreBooking2Progress: false,
            corpPickupPlaceAddress: ''
          });

        }
      }
    }).catch((err) => {
      this.setState({ isFetchingPreBooking2Progress: false });
      this.refs.toast.show('Failure');
    })

  };

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };

  onBookButtonClick2 = async () => {

    // this.scroll.scrollTo({ y: 125, animated: true })
     // console.log(" this.state.corpSelectedReportingPlaceId -- ",this.state.corpSelectedReportingPlaceId);
    if ((this.state.corpSelectedReportingPlaceId == 0|| this.state.corpSelectedReportingPlaceId == -1 ||
      this.state.corpSelectedReportingPlaceId == undefined ||
      this.state.corpSelectedReportingPlaceId == null) && this.state.showReportingPlace == true) {
     // this.refs.toast.show('Please Select a Reporting Place');
      alert('Please Select Reporting Place');
      return;
    } 
    
    if(this.state.TripDetailsId == 0 || this.state.TripDetailsId == -1 ||
      this.state.TripDetailsId == undefined || this.state.TripDetailsId == null){
      alert('Please Select Trip Details');
     return;
   }
   
    if (this.state.isPickUpAddressAvailable) {
      if (this.state.corpPickupPlaceAddress == "" ||
        this.state.corpPickupPlaceAddress == undefined ||
        this.state.corpPickupPlaceAddress == null) {
        this.scroll.scrollTo({ y: 455, animated: true });
        alert('Please Enter Reporting Address');
        return;
      }
    }

    if (this.state.isFlightVisible || this.state.isTrainVisible) {

      if (this.state.Flight_TrainNo == "" ||
        this.state.Flight_TrainNo == undefined ||
        this.state.Flight_TrainNo == null) {
        this.scroll.scrollTo({ y: 555, animated: true });
        alert('Please Enter Flight/Train No');
        return;
      }

      if (this.state.BoardingPlace == "" ||
        this.state.BoardingPlace == undefined ||
        this.state.BoardingPlace == null) {
        this.scroll.scrollTo({ y: 605, animated: true });
        alert('Please Enter BoardingPlace');
        return;
      }
    }
    if (this.state.NoOfPassanger == "" ||
      this.state.NoOfPassanger == undefined ||
      this.state.NoOfPassanger == null) {
      this.scroll.scrollTo({ y: 605, animated: true });
      alert('Please Enter NoOfPassanger');
      return;
    }

    if (!this.state.isPickUpAddressAvailable && !(this.props.baseData.location3)) {
      alert('Please enter a Reporting Address');
      return;
    }

    let appBookingRefId = "0";
    try {
      let value =  AsyncStorage.getItem('AppBookingRefId');
      if (value !== null) {
        // console.log(value);
        value = parseInt(value + "");
        appBookingRefId = value + 1;
        appBookingRefId = appBookingRefId + "";
      } else {
        appBookingRefId = "7";
      }
      await AsyncStorage.setItem('AppBookingRefId', appBookingRefId);
    } catch (error) {
    }
    // console.log("this.state.chosenDate ---", this.state.chosenDate);

    let journeyDate = this.state.chosenDate.getFullYear() + "-" + (this.state.chosenDate.getMonth() + 1) + "-" + this.state.chosenDate.getDate()
    let journeyTime = this.state.chosenDate.toTimeString().split(' ')[0]
    let reqBody = {
      // "AppBookingRefId": appBookingRefId,
      "PassengerMobileNo": this.props.auth.token.MobileNo1,
      "JourneyDate": journeyDate,
      "JourneyTime": journeyTime,
      "ReqVehicleType": this.state.corpSelectedVehicelId + "",
      "CustomerId": this.props.auth.token.CustomerId,
      "PassengerId": this.props.auth.token.PassengerId, 
      "ServiceCityId": this.state.corpSelectedCityId,
      "TripTypeId": this.state.corpSelectedTripId,
      "TripDetails": this.state.TripDetails,
      "PickupPlaceTypeId": this.state.corpSelectedReportingAtId,
      "PickupPlaceId": this.state.corpSelectedReportingPlaceId,
      "PickupAddress": this.state.isPickUpAddressAvailable ? this.state.corpPickupPlaceAddress : this.props.baseData.location3.address,
      "PickupLandmark": "",
      "PickupLatitude": "",
      "PickupLongitude": "",
      "TripToAddress": "",
      "Flight_TrainNo": this.state.Flight_TrainNo,
      "BoardingPlace": this.state.BoardingPlace,
      "TripToLatitude": "",
      "TripToLongitude": "",
      "AddtionalBookingInfo": this.state.AddtionalBookingInfo,
      "NoOfPassengers": this.state.NoOfPassanger,
      "PersonalBooking": this.state.switchValue2
      // "PickupAddress": this.props.baseData.location1.address,
      // "TripToAddress": this.props.baseData.location2.address,
      // "PickupLongitude": this.props.baseData.location1.latLng.lng,
      // "PickupLatitude": this.props.baseData.location1.latLng.lat,
      // "TripToLongitude": this.props.baseData.location2.latLng.lng,
      // "TripToLatitude": this.props.baseData.location2.latLng.lat
    }

    // console.log("reqBody" + JSON.stringify(reqBody));
    this.setState({ isNewBookingInProgress: true });
    this.props.newBooking(reqBody).then((data) => {
      // console.log("----" + JSON.stringify(data));
      this.refs.toast.show(data.Message);
      this.setState({
        isNewBookingInProgress: false
      })
      if (data.Status == 200) {
        this.resetAllFields();
        this.props.navigation.navigate("My Bookings");
      } else {
        alert(data.Message);
      }
    }).catch((err) => {
      this.setState({ isNewBookingInProgress: false });
      alert('Failure');
    })

  };

  callButtonPressed = async() =>{ 
    let customerCareNumber =  await AsyncStorage.getItem('customerCareNumber');
    if(customerCareNumber){
    Linking.openURL(`tel:${customerCareNumber}`) 
    }
  }

  resetAllFields = () => {
    this.setState({
      chosenDate: new Date(),
      corpSelectedCityId: this.state.homeCityId,
      corpSelectedTripId: -1,
      TripDetails: -1,
      corpSelectedVehicelId: -1,
      corpSelectedReportingAtId: -1,
      corpSelectedReportingPlaceId: -1,
      isTrainVisible: false,
      isFlightVisible: true,
      isOthersVisible: false,
      corpPickupPlaceAddress: null,
      Flight_TrainNo: null,
      BoardingPlace: null,
      NoOfPassanger: null,
      AddtionalBookingInfo: '',
      instructionMessage: '',
      isDateTimeInstructionVisible: false,
      tarriffData: null
    })
    this.props.resetAutoCompleteFields();
    this.fetchBaseData();
  }

  onBookButtonClick = async () => {

    if (!(this.props.baseData.location1 && this.props.baseData.location1.latLng)) {
      this.refs.toast.show('Please enter a PickUp address');
      return;
    }

    if (!(this.props.baseData.location2 && this.props.baseData.location2.latLng)) {
      this.refs.toast.show('Please enter a Drop address');
      return;
    }

    let appBookingRefId = "0";
    try {
      let value = await AsyncStorage.getItem('AppBookingRefId');
      if (value !== null) {
        // console.log(value);
        value = parseInt(value + "");
        appBookingRefId = value + 1;
        appBookingRefId = appBookingRefId + "";
      } else {
        appBookingRefId = "7";
      }
      await AsyncStorage.setItem('AppBookingRefId', appBookingRefId);
    } catch (error) {
    }
    // console.log("this.state.chosenDate ---", this.state.chosenDate);

    let journeyDate = this.state.chosenDate.getFullYear() + "-" + (this.state.chosenDate.getMonth() + 1) + "-" + this.state.chosenDate.getDate()
    let journeyTime = this.state.chosenDate.toTimeString().split(' ')[0]
    let reqBody = {
      // "AppBookingRefId": appBookingRefId,
      "PassengerMobileNo": this.props.auth.token.MobileNo1,
      "JourneyDate": journeyDate,
      "JourneyTime": journeyTime,
      "ReqVehicleType": this.state.selectedVehicelType + "",
      "PickupAddress": this.props.baseData.location1.address,
      "TripToAddress": this.props.baseData.location2.address,
      "PickupLongitude": this.props.baseData.location1.latLng.lng,
      "PickupLatitude": this.props.baseData.location1.latLng.lat,
      "TripToLongitude": this.props.baseData.location2.latLng.lng,
      "TripToLatitude": this.props.baseData.location2.latLng.lat
    }

    // console.log("reqBody" + JSON.stringify(reqBody));
    this.setState({ isNewBookingInProgress: true });
    this.props.newBooking(reqBody).then((data) => {
      // console.log("----" + JSON.stringify(data));
      this.refs.toast.show(data.Message);
      this.setState({
        chosenDate: new Date(),
        selectedVehicelType: 1,
        isNewBookingInProgress: false
      })
      this.props.resetAutoCompleteFields();
      this.props.navigation.navigate("My Bookings");
    }).catch((err) => {
      this.setState({ isNewBookingInProgress: false });
      this.refs.toast.show('Failure');
    })

  };

  closeDateCalender = () => {
    this.hideDateTimePicker();
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {

    if (date.getTime() - new Date().getTime() <= 3600000) {
      this.setState({
        isDateTimeInstructionVisible: true,
        instructionMessage: `* Booking will be confirmed on availbility because of short notice of less than 1 hour`
      })
    } else {
      this.setState({ isDateTimeInstructionVisible: false });
    }
    // else if (currentTimestamp - date.getTime() > abc2) {
    //   this.setState({ isDateTimeInstructionVisible: true, instructionMessage: 'xyz2' })
    // }

    this.hideDateTimePicker();
    this.setState({ chosenDate: date });
  };

}

const mapStateToProps = state => ({
  baseData: state.baseData,
  auth: state.auth,
  bookings: state.bookings
});

const mapDispatchToProps = dispatch => ({
  googleMapAutoComplete1: () => dispatch(googleMapAutoComplete1()),
  googleMapAutoComplete2: () => dispatch(googleMapAutoComplete2()),
  corpGoogleMapAutoComplete: () => dispatch(corpGoogleMapAutoComplete()),
  resetAutoCompleteFields: () => dispatch(resetAutoCompleteFields()),
  fetchVehicleType: () => dispatch(fetchVehicleType()),
  fetchVehicleTypeOnly: (customerId,passengerId,corpSelectedCityId) => dispatch(fetchVehicleTypeOnly(customerId,passengerId,corpSelectedCityId)),
  fetchCorporateBookingBaseData: (passengerId) => dispatch(fetchCorporateBookingBaseData(passengerId)),
  fetchCorporateBookingBaseData2: (reqBody) => dispatch(fetchCorporateBookingBaseData2(reqBody)),
  newBooking: (reqBody) => dispatch(newBooking(reqBody)),
  updateDisclaimer: (reqBody) => dispatch(updateDisclaimer(reqBody)),
  getDisclaimer: (passengerId) => dispatch(getDisclaimer(passengerId)),
  getTarrifDetails:(custId,ServiceCityId,VehicleTypeId) => dispatch(getTarrifDetails(custId,ServiceCityId,VehicleTypeId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);



const styles = StyleSheet.create({

  

  tariffButton: {
    alignItems: "center",
    marginTop: 3,
    paddingTop: 3,
    paddingBottom: 0,
    backgroundColor: '#CA6C39',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff'

  },
  containerTariff: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  itemTariff: {
    padding: 0,
    marginVertical: 1,
    marginHorizontal: 16,
  },
  titleTariff: {
    fontSize: 12,
     fontWeight: "bold",
  },
   subTitleTariff: {
    fontSize: 10,
  },
  subItemTariff: {
    padding: 0,
    marginVertical: 2,
    marginHorizontal: 16,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    zIndex: 999,
    backgroundColor: '#000000',
    opacity: 0.5
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
  tariffContainer: {
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
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: '#eaeaea'
  },
  contentContainerHorzSlider: {
    marginTop: 3,
    marginStart: 10,
    marginBottom: 80
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 150,
    height: 120,
    resizeMode: 'stretch',
    marginTop: 0,
    marginLeft: 0,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  headerBody: {
    flex: 0.6,
    flexDirection: 'column'
  },
  textBody: {
    alignSelf: "center",
    color: "white"
  },
  buttonContainer: {
    marginTop: 20,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    borderRadius: 30,
    backgroundColor: "#CA6C39",
  },
  addressLabel: {
    fontWeight: "500",
    marginStart: 8,
    paddingTop: 8,

  },
  originText: {
    fontWeight: "300",
    fontSize: 16,
    marginStart: 8,
    paddingTop: 10,
    paddingBottom: 10
  },
  statusBar: {
    backgroundColor: "#A3552A",
    height: Constants.statusBarHeight,
  },
  toggleButtonStyle: {
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 12,
    marginLeft: 12,
    marginBottom: 6
  },
  acceptDiscloserViewStyle: {
    flex: 1,
    width: "100%",
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#eaeaea',
  },
  acceptTouchableButtonStyle: {
    flex: 1,
    width: "100%",
    backgroundColor: '#CA6C39',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'

  },
  info: {
    fontSize: 16,
    color: "#000000",
    marginTop: 1,
    borderColor: '#d6d6d6',
    borderWidth: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff'
  }
});

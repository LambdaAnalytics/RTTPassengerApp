import React from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
    Dimensions, Image, Platform, Linking,
    ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar,
    Button, AsyncStorage, FlatList, ActivityIndicator, YellowBox
} from 'react-native';
import _ from 'lodash';
import { Header, Left, Container, Body, Title, Right, Icon, Content, Input, Item, Card, DatePicker, Label } from "native-base";
import { connect } from "react-redux";
import { userRequestLogout, getImeiNumberBasedOnVehicleNo } from "../actions";
import { MaterialIcons } from '@expo/vector-icons'
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
// const extractKey = ({ JourneyDate }) => JourneyDate + "";
const extractKey = ({ }) => Math.random().toString(36).substring(7);
const GOOGLE_MAPS_APIKEY = 'AIzaSyDSvqFVfMDtPftyvZJMrEYeqF5R5dXc6nE';
const { width, height } = Dimensions.get('window');
// import { Constants } from 'expo';
import Constants from 'expo-constants'
import SocketIOClient from 'socket.io-client';
import { Svg, Path , G , } from 'react-native-svg';
const json = require('./../assets/images/svg.json');
import Images from './../assets/images/index';
import carImage from './../assets/images/car.png';
import flagPink from './../assets/images/flag-small.png';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import ThreeDRotationIcon from '@material-ui/icons/ThreeDRotation';
import FourKIcon from '@material-ui/icons/FourK';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import { makeStyles } from '@material-ui/core/styles';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class BookingDetailsScreen extends React.Component {

    static navigationOptions = {
        headerShown: false
    };



    constructor(props) {
        super(props);
        YellowBox.ignoreWarnings(['Setting a timer']);
        const _console = _.clone(console);
        console.warn = message => {
            if (message.indexOf('Setting a timer') <= -1) {
                _console.warn(message);
            }
        };
        this.mapRef = null;
        this.classes = null;
        this.useStyles = null;
        this.state = {
            bookingObj: undefined,
            imeiNumber: undefined,
            carLocation: undefined
           
        }


       
    }

    componentWillMount() {

        const { navigation } = this.props;
        let item = navigation.getParam('item', undefined);
        this.setState({ bookingObj: item });
        this.setState({ DriverMobileNo : item.DriverMobileNo});
        this.setState({ isSocketNotConnected: true });
        //alert(JSON.stringify(item));

        //SOCKET RAJA TILL EOF

        if (this.isDynamicMapAvailable(item)) {  http://localhost:9000'
            this.socket = SocketIOClient('http://ws.hawkeyeway.com', {
                timeout: 5000
            });

            this.socket.on('connect', () => {
                // console.log("Connected");
                // alert(this.state.bookingObj.MobileTrackingIMEINo1);
                if (this.state.bookingObj && this.state.bookingObj.MobileTrackingIMEINo1) {
                    if ((!this.locationRepeatedTimer) || (this.locationRepeatedTimer && this.locationRepeatedTimer.state == "notScheduled")) {
                        // SOCKET RAJA
                        this.locationRepeatedTimerOnce = setInterval (() => { this.socket.emit('getLocationForMobile', this.state.bookingObj.MobileTrackingIMEINo1); }, 500);
                        this.locationRepeatedTimer = setInterval (() => { this.socket.emit('getLocationForMobile', this.state.bookingObj.MobileTrackingIMEINo1); }, 5000);
                      //  alert("Timer --> "+this.locationRepeatedTimer);
                      

                    }

                }
            }); 

            if (this.socket.listeners('getLocationForMobile').length < 1) {
                
                this.socket.on('getLocationForMobile', (locationData) => {
                    clearInterval(this.locationRepeatedTimerOnce);
                  
                    this.setState({ isSocketNotConnected: false });
                     let data =JSON.parse(locationData);

                    const { coordinate } = this.state;
                    const newCoordinate = {
                        latitude: data.location.lat,
                        longitude: data.location.lng,
                        latitudeDelta: 0,
                        longitudeDelta: 0,
                    };

                    this.setState({
                        carLocation: {
                            latitude: data.location.lat,
                            longitude: data.location.lng
                        }
                    });
                     this.mapRef.fitToCoordinates([{
                         latitude: data.location.lat,
                         longitude: data.location.lng
                     },
                     {
                         latitude: parseFloat(this.state.bookingObj.PickupLatitude),
                         longitude: parseFloat(this.state.bookingObj.PickupLongitude)
                     }],  {
                        edgePadding: { top: 75, right: 75, bottom: 75, left: 75 },
                        animated: false,
                      })
   /*
                    this.mapRef.fitToCoordinates([{
                        latitude: data.location.lat,
                        longitude: data.location.lng
                    }], false)
                */


                    // if (Platform.OS === 'android') {

                    //     if (this.marker) {
                    //         this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
                    //     }
                    // } else {
                    //     coordinate.timing(new AnimatedRegion(newCoordinate), 1).start();
                    //     this.marker._component.animateMarkerToCoordinate(newCoordinate, 500)
                    //     this.setState({ coordinate: new AnimatedRegion(newCoordinate) })
                    // }

                    /*  const { coordinate } = this.state;
                     const newCoordinate = {
                         latitude: data.location.lat + ((Math.random() - 0.5) * (0.04 / 2)),
                         longitude: data.location.lng + ((Math.random() - 0.5) * (0.05 / 2))
                     }; */

                    //this command will move the MARKER to the new location when the user double clicks on one of the locations in the drop down
                    // coordinate.timing(newCoordinate).start();
                    // this.marker._component.animateMarkerToCoordinate(
                    //     { latitude: data.location.lat, longitude: data.location.lng },
                    //     500
                    // );
                });
            }
        }else{
            this.setState({ isSocketNotConnected: false });
        }
    }

    componentWillUnmount() {

        if (this.isDynamicMapAvailable(this.state.bookingObj)) {

            // SOCKET RAJA
            this.socket.removeAllListeners('getLocationForMobile');
            clearInterval(this.locationRepeatedTimer);
        }
    }
    render() {

        // console.log("item =====" + JSON.stringify(this.state.bookingObj));

        let item = this.state.bookingObj;
        let origin = null;
        let destination = null;
        if (item && item.PickupLatitude != "" && item.TripToLatitude != "" && item.PickupLatitude != null && item.TripToLatitude != null) {
            origin = { latitude: parseFloat(item.PickupLatitude), longitude: parseFloat(item.PickupLongitude) };
            destination = { latitude: parseFloat(item.TripToLatitude), longitude: parseFloat(item.TripToLongitude) };
        }
        this.setState


        if (this.props.isFetching) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator animating={true} />
                </View>
            )
        }

        return (
            <View style={styles.container}>
                {/* <View style={styles.statusBar} /> */}
               
                <Header
                    androidStatusBarColor={"#CA6C39"}
                    style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>
                    <Body style={styles.headerBody}>
                        <Title style={styles.textBody}>Booking Details </Title>
                    </Body>
                </Header>
                <ScrollView contentContainerStyle={styles.contentContainer}>
               
                    
                    <View style={{ flex: 1 }}>
                        {/* <Button title="Show me more of the app" onPress={this._showMoreApp} /> */}
                        {this.renderMapOrImage(item, origin, destination)}
                        
                        {/* <Card style={styles.row}>
                        <View style={styles.contentRow}>
                            <Text style={styles.row_time}>{this.formatDate(item.JourneyDate)}</Text>
                            <View style={styles.row_cell_places}>
                                <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="adjust" />
                                <Text style={styles.row_place}>{item.PickupAddress}</Text>
                            </View>
                            <View style={styles.row_cell_places}>
                                <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="album" />
                                <Text style={styles.row_place}>{item.TripToAddress}</Text>
                            </View>
                        </View>
                    </Card> */}
                        <Text style={styles.row_header}>Booking Details </Text>

                            {(this.state.isSocketNotConnected ) &&
                                  <View style={styles.loading}>
                                  <ActivityIndicator animating={true} size='large' color="black" />
                         </View>
                }
                        
                        <Card style={styles.row}>
                            <View style={styles.contentRow}>
                                <Text style={styles.row_time}>{this.formatDate(item.JourneyDate) != null ? this.formatDate(item.JourneyDate) : ""}</Text>
                                <View style={styles.row_cell_places}>
                                    <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="adjust" />
                                    <Text style={styles.row_place}>{item.PickupAddress}</Text>
                                </View>
                                {item.TripToAddress != null && item.TripToAddress != "" &&
                                    <View style={styles.row_cell_places}>
                                        <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="album" />
                                        <Text style={styles.row_place}>{item.TripToAddress}</Text>
                                    </View>
                                }
                            </View>
                        </Card>
                        <Text style={styles.row_header}>Vehicle Details</Text>
                        <Card style={styles.row}>
                            <View style={styles.contentRow}>
                                {/* <Text style={styles.row_time}>{this.formatDate(item.JourneyDate)}</Text> */}
                                <View style={styles.row_cell_places}>
                                    {/* <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="adjust" /> */}
                                    <Text style={styles.row_ques}>Trip ID</Text>
                                    <Text style={styles.row_ans}>{item.BookingId}</Text>
                                </View>
                                <View style={styles.row_cell_places}>
                                    {/* <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="adjust" /> */}
                                    <Text style={styles.row_ques}>Driver Name</Text>
                                    <Text style={styles.row_ans}>{item.DriverName ? item.DriverName : '-NA-'}</Text>
                                </View>
                                <View style={styles.row_cell_places}>
                                    {/* <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="album" /> */}
                                    <Text style={styles.row_ques}>Vehicle Number</Text>
                                    <Text style={styles.row_ans}>{item.VehicleNo ? item.VehicleNo : '-NA-'}</Text>
                                </View>
                                <View style={styles.row_cell_places}>
                                    {/* <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="album" /> */}
                                    <Text style={styles.row_ques}>Booking Status</Text>
                                    <Text style={styles.row_ans}>{item.BookingStatusName}</Text>
                                </View>
                                
                               
                                {this.state.DriverMobileNo &&
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            position: 'absolute',
                            bottom: 25,
                            right: 25,
                            height: 40,
                            backgroundColor: '#CA6C39',
                            borderRadius: 100,
                        }}
                        onPress={this.onCallClick}
                    >
                        <Icon name="md-call" size={30} color="#ffffff" style={{ color: "#ffffff" }} />
                       
                    </TouchableOpacity>
                }   
                              <View style={styles.row_cell_temp_button}>
                                    {/* <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="album" /> */}
                                    <Text style={styles.row_ques_Call_Button}>Contact Driver</Text>  
                              </View>
                            </View>
                        </Card>
                    </View>
                </ScrollView>
               
            </View>
        );
    }   
   
    

    renderMapOrImage(item, origin, destination) {
        if (!this.isDynamicMapAvailable(item)) {

                let imgSrc = item.TripRouteURL; 
          //    let imgSrc = "https://o.img.rodeo/sample.jpg";
              
               
            if (item.BookingStatusName == 'Booking Created') {
                imgSrc = Images.main_icon;
                return (
                    <Card style={styles.row}>
                        <Image
                            style={styles.stretch}
                            source={imgSrc
                              }
                        />
                    </Card>
                )
            }else{      
                return (
                    <Card style={styles.row}>
                        <Image
                            style={styles.stretch}
                            source={{uri:imgSrc
                            }}
                              
                        />
                    </Card>
                )
            }
           
        } else {
            return (
                <Card style={styles.row}>
                    <MapView 
                        ref={(ref) => { this.mapRef = ref }}
                        // onLayout={() => this.mapRef.fitToCoordinates([{
                        //     latitude: parseFloat(this.state.bookingObj.PickupLatitude),
                        //     longitude: parseFloat(this.state.bookingObj.PickupLongitude)
                        // }], false)}
                        style={{
                            height: 280 
                        }}>
                        {this.state.carLocation &&
                            <MapView.Marker.Animated
                                coordinate={{
                                    latitude: parseFloat(this.state.carLocation.latitude),
                                    longitude: parseFloat(this.state.carLocation.longitude)
                                }}
                                image={carImage}
                                title='source'
                                ref={marker => { this.marker = marker }}
                                description='source'>
                            </MapView.Marker.Animated>
                        }
                        {this.state.bookingObj && this.state.bookingObj.PickupLongitude &&
                            // {destination &&
                              <Marker
                                coordinate={{
                                    latitude: parseFloat(this.state.bookingObj.PickupLatitude),
                                    longitude: parseFloat(this.state.bookingObj.PickupLongitude)
                                }} 
                                centerOffset={{ x: -40, y: -60 }}
                                anchor={{ x: 1, y: 1 }}
                                image={flagPink}
                                />
                                
                            
                        }
                        {/* {this.state.carLocation && this.state.bookingObj.PickupLongitude && */}
                        {this.state.bookingObj && origin &&
                            <MapViewDirections
                                origin={this.state.carLocation}
                                destination={{
                                    latitude: parseFloat(this.state.bookingObj.PickupLatitude),
                                    longitude: parseFloat(this.state.bookingObj.PickupLongitude)
                                }}
                                apikey={GOOGLE_MAPS_APIKEY}
                                onReady={result => {
                                    this.mapRef.fitToCoordinates(result.coordinates);
                                }}
                            />
                        }
                    </MapView>
                </Card>
            )
        }
    }

    onCallClick = async () => {
        let supportNumber = await AsyncStorage.getItem('supportNumber')
     
        if(supportNumber != null){
          Linking.openURL(`tel:${supportNumber}`)
        }
     
    };

    formatDate(dateVal) {
        let newDate = new Date(dateVal);
        newDate.setTime(newDate.getTime() + newDate.getTimezoneOffset() * 60 * 1000);
        let sMonth = this.padValue(newDate.getMonth() + 1);
        let sDay = this.padValue(newDate.getDate());
        let sYear = newDate.getFullYear();
        let sHour = newDate.getHours();
        let sMinute = this.padValue(newDate.getMinutes());
        let sAMPM = "AM";

        let iHourCheck = parseInt(sHour);

        if (iHourCheck > 12) {
            sAMPM = "PM";
            sHour = iHourCheck - 12;
        }
        else if (iHourCheck === 0) {
            sHour = "12";
        }

        sHour = this.padValue(sHour);

        return sDay + "/" + sMonth + "/" + sYear + ", " + sHour + ":" + sMinute + " " + sAMPM;
    }

    padValue(value) {
        return (value < 10) ? "0" + value : value;
    }

    isDynamicMapAvailable(item) {
        if (item.BookingStatusName == "Trip Rejected" || item.BookingStatusName == "Trip Closed" ||
            item.BookingStatusName == "Trip Cancelled" || item.BookingStatusName == "No Show" ||
            item.BookingStatusName == "Trip Completed" || item.BookingStatusName == "Booking Created") {
            return false;
          
        } else {
          
            return true;
        }
    }
}

const mapStateToProps = state => ({
    bookings: state.bookings,
    auth: state.auth,
    isFetching: state.bookings.isFetching
});

const mapDispatchToProps = dispatch => ({
    getImeiNumberBasedOnVehicleNo: (reqBody) => dispatch(getImeiNumberBasedOnVehicleNo(reqBody))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BookingDetailsScreen);

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
    headerBody: {
        flex: 0.4
    },
    textBody: {
        alignSelf: "center",
        color: "white"
    },
    // row: {
    //   padding: 15
    // },
    listContainer: {
        flex: 1,
        marginTop: 5
    },
    contentRow: {
        // flex: 1,
        // flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 0,
        marginBottom: 2
    },
    contentContainer: {
        flexGrow: 1,
        backgroundColor: '#eaeaea'
    }
    ,
    row: {
        // flex: 1
        // height: 200
        // alignItems: 'center', // cross axis
    },
    row_cell_timeplace: {
        flex: 1,
        flexDirection: 'column',
    },
    row_cell_places: {
        // flex: 1,
        flexDirection: 'row'
    },
    row_cell_temp: {
        color: "#000000",
        paddingLeft: 16,
        fontSize: 20
    },
    row_cell_temp_button: {
        color: "#000000",
        paddingLeft: 10,
        fontSize: 20
    },
    row_time: {
        color: "#000000",
        textAlignVertical: 'bottom',
        includeFontPadding: false,
        fontSize: 15,
        marginBottom: 5,
        fontWeight: "bold"
    },
    row_header: {
        color: "#000000",
        textAlignVertical: 'bottom',
        includeFontPadding: false,
        fontSize: 18,
        marginBottom: 5,
        fontWeight: "bold",
        marginTop: 5,
        marginLeft: 14
    },
    row_place: {
        color: "#000000",
        textAlignVertical: 'top',
        includeFontPadding: false,
        fontSize: 15
    },
    row_ans: {
        color: "#000000",
        textAlignVertical: 'top',
        includeFontPadding: false,
        fontSize: 15,
        flex: 0.6
    },
    row_ques: {
        color: "#000000",
        textAlignVertical: 'top',
        includeFontPadding: false,
        fontSize: 15,
        flex: 0.4,
        fontWeight: "bold"
    },
    row_ques_Call_Button: {
        color: "#000000",
        textAlignVertical: 'top',
        includeFontPadding: false,
        fontSize: 10,
        flex: 0.4,
        marginLeft: 295,
        resizeMode: 'stretch'
    },
    statusBar: {
        backgroundColor: "#A3552A",
        height: Constants.statusBarHeight,
    },
    stretch: {
        width: "100%",
        height: 240,
        resizeMode: 'stretch'
    }
});

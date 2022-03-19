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
import { Svg, Path } from 'react-native-svg';
const json = require('./../assets/images/svg.json');
import Images from './../assets/images/index';

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
        this.state = {
            bookingObj: undefined,
            imeiNumber: undefined,
            carLocation: undefined
            // ,
            // coordinate: new AnimatedRegion({
            //     latitude: 12.9121181, longitude: 77.6445548,
            //     latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA
            // })
        }
    }


    componentDidMount() {
        const { navigation } = this.props;
        let item = navigation.getParam('item', undefined);
        this.setState({ bookingObj: item });

        //SOCKET RAJA TILL EOF
       
        if (this.isDynamicMapAvailable(item)) {
           // this.socket = SocketIOClient('http://ws.hawkeyeway.com', {
            this.socket = SocketIOClient('http://localhost:9000', {  
              timeout: 5000
             });
    
            this.socket.on('connect', () => {
                console.log("Connecting with localhost Socket");
                if (this.state.bookingObj && this.state.bookingObj.GPSTrackingIMEINo1) {
                    if ((!this.locationRepeatedTimer) || (this.locationRepeatedTimer && this.locationRepeatedTimer.state == "notScheduled")) {
                        // SOCKET RAJA
                        this.locationRepeatedTimer = setInterval(() => { this.socket.emit('getLocation', "0" + this.state.bookingObj.GPSTrackingIMEINo1); }, 5000);
                    }

                }
            });

            if (this.socket.listeners('getLocation').length < 1) {
                this.socket.on('getLocation', (data) => {
                    // console.log("data === >>>", data);
                    alert(data); 
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
                    // this.mapRef.fitToCoordinates([{
                    //     latitude: data.location.lat,
                    //     longitude: data.location.lng
                    // },
                    // {
                    //     latitude: parseFloat(this.state.bookingObj.PickupLatitude),
                    //     longitude: parseFloat(this.state.bookingObj.PickupLongitude)
                    // }], false)

                    this.mapRef.fitToCoordinates([{
                        latitude: data.location.lat,
                        longitude: data.location.lng
                    }], false)


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
        }
    }

    componentWillUnmount() {

        if (this.isDynamicMapAvailable(this.state.bookingObj)) {

            // SOCKET RAJA
            this.socket.removeAllListeners('getLocation');
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
                        <Card style={styles.row}>
                            <View style={styles.contentRow}>
                                <Text style={styles.row_time}>{this.formatDate(item.JourneyDate) != null ? this.formatDate(item.JourneyDate) : ""}</Text>
                                <View style={styles.row_cell_places}>
                                    <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="adjust" />
                                    <Text style={styles.row_place}>{item.PickupAddress}</Text>
                                </View>
                                {item.TripToAddress &&
                                    // {item.TripToAddress != null || item.TripToAddress != "" &&
                                    <View style={styles.row_cell_places}>
                                        <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="album" />
                                        <Text style={styles.row_place}>{item.TripToAddress}</Text>
                                    </View>
                                }
                            </View>
                        </Card>
                        <Text style={styles.row_header}>Vehicle Details </Text>
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
                            </View>
                        </Card>
                    </View>
                </ScrollView>
                {this.state.DriverMobileNo &&
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            height: 50,
                            backgroundColor: '#CA6C39',
                            borderRadius: 100,
                        }}
                        onPress={this.onCallClick}
                    >
                        <Icon name="md-call" size={30} color="#ffffff" style={{ color: "#ffffff" }} />
                    </TouchableOpacity>
                }
            </View>
        );
    }

    renderMapOrImage(item, origin, destination) {
        if (!this.isDynamicMapAvailable(item)) {
            return (
                <Card style={styles.row}>
                    <Image
                        style={styles.stretch}
                        source={Images.sample_image}
                    />
                </Card>
            )
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
                            height: 240
                        }}>
                        {this.state.carLocation &&
                            <MapView.Marker.Animated
                                coordinate={{
                                    latitude: parseFloat(this.state.carLocation.latitude),
                                    longitude: parseFloat(this.state.carLocation.longitude)
                                }}
                                title='source'
                                ref={marker => { this.marker = marker }}
                                description='source'>
                                <Svg width={40} height={22}>
                                    <Path scale={.5} d="M45.961,18.702c-0.033-0.038-0.061-0.075-0.1-0.112l-1.717-1.657c1.424-0.323,2.957-1.516,2.957-2.74   c0-1.426-1.979-1.932-3.668-1.932c-1.766,0-1.971,1.21-1.992,2.065l-4.43-4.271c-0.9-0.891-2.607-1.592-3.883-1.592H24.5h-0.002   h-8.63c-1.275,0-2.981,0.701-3.882,1.592l-4.429,4.271c-0.023-0.855-0.228-2.065-1.992-2.065c-1.691,0-3.669,0.506-3.669,1.932   c0,1.224,1.534,2.417,2.958,2.74l-1.717,1.657c-0.039,0.037-0.066,0.074-0.1,0.112C1.2,20.272,0,23.184,0,25.297v6.279   c0,1.524,0.601,2.907,1.572,3.938v2.435c0,1.424,1.192,2.585,2.658,2.585h3.214c1.466,0,2.657-1.159,2.657-2.585v-0.623h14.397   H24.5h14.396v0.623c0,1.426,1.19,2.585,2.658,2.585h3.213c1.467,0,2.657-1.161,2.657-2.585v-2.435   c0.972-1.031,1.572-2.414,1.572-3.938v-6.279C48.998,23.184,47.798,20.272,45.961,18.702z M13.613,11.953   c0.623-0.519,1.712-0.913,2.255-0.913h8.63H24.5h8.63c0.543,0,1.632,0.394,2.255,0.913l5.809,5.63H24.5h-0.002H7.805L13.613,11.953   z M1.993,24.347c0-1.546,1.21-2.801,2.704-2.801c1.493,0,6.372,2.864,6.372,4.41s-4.879,1.188-6.372,1.188   C3.203,27.144,1.993,25.894,1.993,24.347z M10.102,34.573H9.587H9.072l-3.055,0.005c-0.848-0.264-1.446-0.572-1.869-0.903   c-0.214-0.167-0.378-0.341-0.506-0.514c-0.129-0.175-0.223-0.347-0.284-0.519c-0.38-1.074,0.405-2.061,0.405-2.061h5.214   l3.476,3.99L10.102,34.573L10.102,34.573z M31.996,34.575H24.5h-0.002h-7.496c-1.563,0-2.832-1.269-2.832-2.831h10.328H24.5h10.328   C34.828,33.308,33.559,34.575,31.996,34.575z M32.654,29.812H24.5h-0.002h-8.154c-1.7,0-3.08-2.096-3.08-4.681h11.234H24.5h11.234   C35.734,27.717,34.354,29.812,32.654,29.812z M45.641,32.644c-0.062,0.172-0.156,0.344-0.285,0.518   c-0.127,0.173-0.291,0.347-0.506,0.514c-0.422,0.331-1.021,0.641-1.869,0.903l-3.055-0.005h-0.515h-0.515h-2.353l3.478-3.99h5.213   C45.234,30.583,46.02,31.568,45.641,32.644z M44.301,27.144c-1.492,0-6.371,0.356-6.371-1.188s4.879-4.41,6.371-4.41   c1.494,0,2.704,1.255,2.704,2.801C47.005,25.892,45.795,27.144,44.301,27.144z" />
                                </Svg>
                            </MapView.Marker.Animated>
                        }
                        {this.state.bookingObj.PickupLongitude &&
                            // {destination &&
                            <Marker
                                coordinate={{
                                    latitude: parseFloat(this.state.bookingObj.PickupLatitude),
                                    longitude: parseFloat(this.state.bookingObj.PickupLongitude)
                                }}
                                title='destination'
                                description='destination'
                            >
                                <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="adjust" />
                            </Marker>
                        }
                        {/* {this.state.carLocation && this.state.bookingObj.PickupLongitude && */}
                        {origin &&
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
        if (this.state.DriverMobileNo) {
            const url = this.state.DriverMobileNo;
            Linking.openURL(url)
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
            item.BookingStatusName == "Trip Completed") {
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

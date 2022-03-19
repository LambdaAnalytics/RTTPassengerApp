import React from "react";
import {
    Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator,
    View, StatusBar, AsyncStorage, TouchableNativeFeedback, TouchableHighlight
} from 'react-native';
import {
    Header, Left, Container, Button, Body, Title, Right, Icon, Content, Input, Item, Card, DatePicker, Label, Picker
} from "native-base";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { connect } from "react-redux";
import { googleMapAutoComplete1, googleMapAutoComplete2, corpGoogleMapAutoComplete } from "../actions";
// import { Constants } from 'expo';
import Constants from 'expo-constants';

class AutoCompleteMap extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    constructor(props) {
        super(props);
         this.state = {
             currentLocationLoading: true,
             location: null,
             errorMessage: null
         }
    }


    _getLocationAsync = async () => {
         let { status } = await Permissions.askAsync(Permissions.LOCATION);
         if (status !== 'granted') {
             this.setState({
                 errorMessage: 'Permission to access location was denied',
             });
         }

         let location = await Location.getCurrentPositionAsync({});
         console.log("location ====" + JSON.stringify(location));

         this.setState({ currentLocationLoading: false, location });
    };

    render() {
        const { navigation } = this.props;
        const type = navigation.getParam('type', 0);
         console.log("=====");
         console.log(type);

        // if (this.state.currentLocationLoading) {
        //     return (
        //         <View style={styles.center}>
        //             <ActivityIndicator animating={true} />
        //         </View>
        //     )
        // }

        return (
            <View style={{ flex: 1 }}>
                {/* <StatusBar translucent={false} /> */}
                {/* <View style={styles.statusBar} /> */}
                {/* <SpinnerOverlay visible={this.props.loading} /> */}
                <Header
                    androidStatusBarColor={"#CA6C39"}
                    style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>
                    <Body style={styles.headerBody}>
                        {/* <Title style={styles.textBody}>Search Location</Title> */}
                    </Body>
                </Header>
                <GooglePlacesAutocomplete
                    placeholder='Search Location'
                    minLength={2} // minimum length of text to search
                    autoFocus={true}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                    listViewDisplayed='auto'    // true/false/undefined
                    fetchDetails={true}
                    renderDescription={(row) => {
                        // console.log("row data >>" + JSON.stringify(row));
                        return (row.description || row.formatted_address || row.vicinity);
                    }
                    } // custom description render
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                        // this.props.handler(data.description);
                        // console.log("details ===>" + JSON.stringify(details));
                        // console.log("data.description ===>" + JSON.stringify(data));
                        if (type == 0) {
                            this.props.googleMapAutoComplete1({ 'address': details.formatted_address, 'latLng': details.geometry.location });
                        } else if (type == 1) {
                            this.props.googleMapAutoComplete2({ 'address': details.formatted_address, 'latLng': details.geometry.location });
                        } else {
                            this.props.corpGoogleMapAutoComplete({ 'address': details.formatted_address, 'latLng': details.geometry.location });
                        }
                        this.props.navigation.goBack();
                    }}

                    getDefaultValue={() => ''}

                    query={{
                        // available options: https://developers.google.com/places/web-service/autocomplete
                        key: 'AIzaSyDSvqFVfMDtPftyvZJMrEYeqF5R5dXc6nE',
                        language: 'en', // language of the results
                        // types: '(cities)', // default: 'geocode'
                        components: 'country:in'
                    }}

                    styles={{
                        textInputContainer: {
                            width: '100%'
                        },
                        description: {
                            fontWeight: 'bold'
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb'
                        }
                    }}

                    currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                    currentLocationLabel="Select Current location"
                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={{
                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }}
                    GooglePlacesSearchQuery={{
                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                        rankby: 'distance',
                        type: 'establishment'
                        // location: this.state.location.coords.latitude + ',' + this.state.location.coords.longitude
                    }}

                    // GooglePlacesDetailsQuery={{
                    //     // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                    //     fields: 'formatted_address',
                    // }}

                    // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                    // predefinedPlaces={[homePlace, workPlace]}

                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                // renderLeftButton={() => <Image source={require('path/custom/left-icon')} />}
                // renderRightButton={() => <Text>Custom text after the input</Text>}
                />
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    googleMapAutoComplete1: (location) => dispatch(googleMapAutoComplete1(
        location
    )),
    googleMapAutoComplete2: (location) => dispatch(googleMapAutoComplete2(
        location
    )),
    corpGoogleMapAutoComplete: (location) => dispatch(corpGoogleMapAutoComplete(
        location
    ))
});

export default connect(
    null,
    mapDispatchToProps
)(AutoCompleteMap);

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
        height: 5
    },
    textBody: {
        alignSelf: "center",
        color: "white"
    },
    statusBar: {
        backgroundColor: "#A3552A",
        height: Constants.statusBarHeight,
    }
});
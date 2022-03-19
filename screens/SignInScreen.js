import React from 'react';
import {
    Image, Platform, ScrollView, StyleSheet, Text, TouchableNativeFeedback, TouchableHighlight, ActivityIndicator,
    View, StatusBar, Button, AsyncStorage, Alert, Switch

} from 'react-native';
import {
    Header, Left, Container, Body, Title, Right, Icon, Content, Input,
    Item, Card, DatePicker, Label

} from "native-base";
import { connect } from "react-redux";
import { userLoginSuccess, userLoginFail, loginRequest, updateFCMKey } from "../actions";
import * as Permissions from 'expo-permissions';
; import { Notifications } from 'expo';

// const PUSH_REGISTRATION_ENDPOINT = 'http://ca0b1c1b.ngrok.io/livepin/public/saveExpoToken';
import { messageService, subscriber } from './../stores/messageService';
// import Images from './../assets/images/index';


class SignInScreen extends React.Component {

    handleEmailChange = (email) => this.setState({ email });
    handlePasswordChange = (password) => this.setState({ password });

    static navigationOptions = { headerShown: false }

    constructor(props) {
        super(props);
        this.state = {
            switchValue: false,
            email: '',
            password: ''
        }
    }

    componentWillUnmount() {
        // if (subscriber)
        //     subscriber.unsubscribe();
    }

    registerForPushNotificationsAsync = async (mobile) => {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
            return;
        }
        let token = await Notifications.getExpoPushTokenAsync();
        // console.log("token --", token);

        // Defined in following steps

        Notifications.addListener(this.handleNotification);
        // console.log("----------------");
        // fetch(PUSH_REGISTRATION_ENDPOINT, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2ExZDJiZDUyOTNiMjA2MTUwNzQ4ZDEiLCJtb2JpbGVOdW1iZXIiOiI5NzAxNjczOTMyIiwibmFtZSI6IlR1cnZvIiwiaWF0IjoxNTU2MTg1MzMzfQ.puqaURM1TkZfbP3aSfJd3ACJZwugWuKVn41e4u_lGBo'
        //     },
        //     body: JSON.stringify({
        //         token: {
        //             value: token,
        //         },
        //         user: {
        //             mobile
        //         }
        //     })
        // }).then((data) => {
        //     console.log(data);
        // }).catch((err) => {
        //     console.log(err);
        // })

        let reqBody = {
            "MobileNumber": mobile,
            "FCMKey": token
        }

        this.props.updateFCMKey(reqBody).then((data) => {
            // console.log("data ---" + JSON.stringify(data));
        }).catch((err) => {
            console.log("err ---", err);
        })

    }

    handleNotification = (notification) => {
        // console.log("------------------");
        subscriber.next(notification);
    }

    componentDidMount() {
        // subscriber.subscribe((v) => {
        //     // console.log("data from subscription " + v);
        //     let message = v.data.message;
        //     this.popup.show({
        //         onPress: () => { console.log('Pressed') },
        //         appIconSource: Images.main_icon,
        //         appTitle: 'RoyalTravels',
        //         timeText: 'now',
        //         title: 'Royal Travels',
        //         body: message,
        //         // body: 'This is a sample message.\nTesting emoji 😀',
        //         slideOutTime: 5000
        //     });
        // })
    }

    async componentWillMount() {


              //       await AsyncStorage.setItem('ENV', 'http://app.royaltour.in:8090/');
                       await AsyncStorage.setItem('ENV', 'https://app.royaltour.in/');



        // let url = await AsyncStorage.getItem('ENV');
        // if (url == 'http://rtt.zegago.com/') {
        //     this.setState({ switchValue: false })
        // } else {
        //     this.setState({ switchValue: true })
        // }
    }

    componentWillReceiveProps(nextProps, nextState) {

        if (this.props.auth.isFailed !== nextProps.auth.isFailed) {
            if (nextProps.auth.isFailed && !nextProps.auth.isAuthenticating) {
                let message = nextProps.auth.error;
                setTimeout(() => {
                    alert(message);
                }, 100);
            }
        }

        if (this.props.auth.token !== nextProps.auth.token) {
            if (nextProps.auth.token) {
                // console.log("nextProps.auth.token ---" + JSON.stringify(nextProps));
                let mobile = nextProps.auth.token.MobileNo1
                this.registerForPushNotificationsAsync(mobile);
                this.props.navigation.navigate("Main");
            }
        }
    }

    render() {

        /* if (this.props.auth.isAuthenticating) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator animating={true} size='large' />
                </View>
            )
        } */

        return (
            <View style={styles.formAlign}>
                {this.props.auth.isAuthenticating &&
                    <View style={styles.loading}>
                        <ActivityIndicator animating={true} size='large' color="black" />
                    </View>
                }



                <Image source={require('../ios/assets/images/Royal_Logo_full.png')} style={styles.imageStyle} />
                <Item style={styles.email} >
                
                    <Label style={{
                        fontWeight: "bold",
                        textAlign : "center"
                    }}>+91</Label>
                    <Input  
                        placeholder='Mobile Number'
                        value={this.state.email}
                        onChangeText={this.handleEmailChange}
                    />
                </Item>
                <Item style={styles.password}>
                    {/* <Label style={{ marginLeft: 6, fontWeight: "bold" }}>Password</Label> */}
                    <Input
                        secureTextEntry
                        style={styles.input}
                        placeholder='Password'
                        value={this.state.password}
                        onChangeText={this.handlePasswordChange}
                    />
                </Item>
                {/* <View style={styles.buttonStyle}>
                    <Button title="Sign in!" onPress={this._signInAsync} color="#CA6C39" />
                </View> */}
                {this.renderSignInButton()}
                {/* <Label style={{ marginLeft: 6, fontWeight: "bold" }}>Password</Label> */}
                <TouchableHighlight
                    onPress={this._forgotPassInAsync}
                    underlayColor='#fff'>
                    <View style={styles.forgotPasswordButton}>
                        <Text style={styles.forgotPasswordText}>First Time User / Forgot Password?</Text>
                    </View>
                </TouchableHighlight>
                {/*
                <TouchableHighlight
                    onPress={this._regsisterInAsync}
                    underlayColor='#fff'>
                    <View style={styles.forgotPasswordButton}>
                        <Text style={styles.forgotPasswordText}>NOT A MEMBER ? SIGN UP</Text>
                    </View>
                </TouchableHighlight>
                */}
                {/*
                <View style={styles.versionText}>
                    <Text style={styles.versionText}>v 0.38d</Text>
                </View>
                */}
                {/* <View style={styles.toggleButtonStyle}>
                    <View style={{ flex: 1.3 }}>
                        <Text style={{ fontWeight: "bold", width: '100%' }}>Switch to {this.state.switchValue ? 'PROD ENV' : 'DEV ENV'}</Text>
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
                </View> */}
                {/* <NotificationPopup ref={ref => this.popup = ref} /> */}
            </View>
        );
    }

    renderSignInButton() {
        if (Platform.OS === 'android') {
            return (
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#ffffff')}
                    delayPressIn={0}
                    onPress={this._signInAsync}
                    underlayColor='#fff'>
                    <View style={styles.loginScreenButton}>
                        <Text style={styles.loginText}>LOGIN</Text>
                    </View>
                </TouchableNativeFeedback>
            )
        } else {
            return (
                <TouchableHighlight
                    onPress={this._signInAsync}
                    underlayColor='#fff'>
                    <View style={styles.loginScreenButton}>
                        <Text style={styles.loginText}>LOGIN</Text>
                    </View>
                </TouchableHighlight>
            )
        }
    }

    // toggleSwitch = async (value) => {
    //     //onValueChange of the switch this function will be called
    //     this.setState({ switchValue: value });
    //     // console.log("value =====", value);
    //     if (value) {
    //         await AsyncStorage.setItem('ENV', 'http://app.royaltour.in:8090/');
    //     } else {
    //         await AsyncStorage.setItem('ENV', 'https://app.royaltour.in/');
    //     }
    // };

    _signInAsync = () => {
        // await AsyncStorage.setItem('userToken', 'abc');
        // this.props.navigation.navigate('Main');
        let mobileNumber = "91" + this.state.email;
        this.props.loginRequest(mobileNumber, this.state.password);
    };

    _forgotPassInAsync = () => {
        // await AsyncStorage.setItem('userToken', 'abc');
        // this.props.navigation.navigate('Main');
        this.props.navigation.navigate('ForgotPassScreen');
    };

    _regsisterInAsync = () => {
        // await AsyncStorage.setItem('userToken', 'abc');
        // this.props.navigation.navigate('Main');
        this.props.navigation.navigate('RegistrationScreen');
    };
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => ({
    loginRequest: (email, password) => dispatch(loginRequest(
        email,
        password,
    )),
    loginSuccess: ({ email, password }) => dispatch(userLoginSuccess({
        email,
        password,
    })),
    loginFail: ({ email, password }) => dispatch(userLoginFail({
        email,
        password,
    })),
    updateFCMKey: (reqBody) => dispatch(updateFCMKey(reqBody))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignInScreen);

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        zIndex: 10,
        backgroundColor: '#000000',
        opacity: 0.5
    },
    email: {
        width: 300,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#CA6C39',
    },
    mobileNumber :{
        width: 300,
        marginTop: 15,
    },
    password: {
        width: 300,
        marginTop: 15,
    },
    formAlign: {
        flex: 1,
        alignItems: 'center'
    },
    mobileInputStyle: {
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#CA6C39',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CA6C39'
    },
    imageStyle: {
        height: 130, width: 160, resizeMode: "contain",
        marginTop: 120
    },
    buttonStyle: {
        width: 320,
        marginTop: 20
    },
    forgotPasswordButton: {
        width: 302,
        marginRight: 40,
        marginLeft: 40,
        marginTop: 10,
        paddingBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    loginScreenButton: {
        width: 302,
        marginRight: 40,
        marginLeft: 40,
        marginTop: 15,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#CA6C39',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    loginText: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: "bold"
    },
    forgotPasswordText: {
        color: '#434544',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: "bold",
        fontSize: 14
    },
    versionText: {
        color: '#CA6C39',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 12,
        marginTop: 10,
        position: 'absolute',
        bottom: 40
    },
    toggleButtonStyle: {
        flexDirection: 'row',
        paddingRight: 12,
        paddingTop: 12,
        paddingLeft: 12,
        paddingBottom: 6,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#eaeaea'
    }
});
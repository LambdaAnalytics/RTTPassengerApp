import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, View, StatusBar, Button, AsyncStorage, FlatList, ActivityIndicator } from 'react-native';
import { Header, Left, Container, Body, Title, Right, Icon, Content, Input, Item, Card, DatePicker, Label } from "native-base";
import { forgotPassword, verifyPassengerOTP, createPassengerPin } from "../actions";
import { MonoText } from '../components/StyledText';
import { connect } from "react-redux";
// import { Constants } from 'expo';
import Constants from 'expo-constants'
import Toast, { DURATION } from 'react-native-easy-toast'

class ForgotPassScreen extends React.Component {

    static navigationOptions = {
        headerShown: false
    };

    handleMobileNumberChange = (mobileNumber) => this.setState({ mobileNumber });
    handleNewPasswordChange = (newPassword) => this.setState({ newPassword });
    handleOTPChange = (otp) => this.setState({ otp });

    constructor() {
        super();
        this.state = {
            isOTPInputVisible: false,
            isPasswordInputVisible: false,
            mobileNumber: "",
            otp: "",
            newPassword: "",
            showProgressSpinner: false
        }
    }


    render() {

        return (
            <View style={styles.container}>
                {/* <View style={styles.statusBar} /> */}
                {/* <StatusBar translucent={false} /> */}
                <Header
                    androidStatusBarColor={"#CA6C39"}
                    style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>
                    <Body style={styles.headerBody}>
                        <Title style={styles.textBody}>Forgot Password</Title>
                    </Body>
                </Header>
                <View style={styles.bodyContent}>
                    {this.state.showProgressSpinner &&
                        <View style={styles.loading}>
                            <ActivityIndicator animating={true} size='large' color="black" />
                        </View>
                    }
                    <Toast ref="toast" positionValue={400} opacity={0.8} />
                    <Item style={styles.email} >
                        <Label style={{
                            fontWeight: "bold",
                            borderColor: '#CA6C39', height: 50, lineHeight: 50, paddingLeft: 100
                        }}>+91</Label>
                        <Input
                            disabled={this.state.isOTPInputVisible}
                           
                            placeholder='Mobile Number'
                            value={this.state.mobileNumber}
                            onChangeText={this.handleMobileNumberChange}
                        />
                    </Item>
                    
                    {this.renderOTPInput()}
                    {this.renderPassInput()}
                    {this.showOTPValidMsg()}
                    {this.renderSendOTPButton()}
                    {this.renderVerifyOTPButton()}
                    {this.renderSubmitNewPassButton()}
                </View>
            </View>
        );
    }

    renderOTPInput() {
        if (this.state.isOTPInputVisible && !this.state.isPasswordInputVisible) {
            return (
                <Item style={styles.otpInput}>
                    {/* <Label style={{ marginLeft: 6, fontWeight: "bold" }}>Email</Label> */}
                    <Input
                        style={styles.input}
                        placeholder='Enter OTP'
                        value={this.state.otp}
                        onChangeText={this.handleOTPChange}
                    />
                </Item>
                
                
            )
        }
    }
    showOTPValidMsg() {
        if (this.state.isPasswordInputVisible) {
            return (
                 <View style={{ margin: 10 }}>
                 <MonoText style={{ marginLeft: 6,marginBottom: 10 }}>
                        * Password should be of 4 digits only
                 </MonoText>
                 </View>
            )
        }
    }

    renderPassInput() {
        if (this.state.isPasswordInputVisible) {
            return (
                <Item style={styles.otpInput}>
                    {/* <Label style={{ marginLeft: 6, fontWeight: "bold" }}>Email</Label> */}
                    <Input
                        style={styles.input}
                        placeholder='Enter New Password'
                        value={this.state.newPassword}
                        onChangeText={this.handleNewPasswordChange}
                    />
                </Item>
            )
        }
    }

    renderVerifyOTPButton() {
        if (this.state.isOTPInputVisible && !this.state.isPasswordInputVisible) {
            if (Platform.OS === 'android') {
                return (
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#ffffff')}
                        delayPressIn={0}
                        onPress={this._verifyOTPInAsync}
                        underlayColor='#fff'>
                        <View style={styles.loginScreenButton}>
                            <Text style={styles.loginText}>VERIFY OTP</Text>
                        </View>
                    </TouchableNativeFeedback>
                )
            } else {
                return (
                    <TouchableHighlight
                        onPress={this._sendOTPInAsync}
                        underlayColor='#fff'>
                        <View style={styles.loginScreenButton}>
                            <Text style={styles.loginText}>VERIFY OTP</Text>
                        </View>
                    </TouchableHighlight>
                )
            }
        }
    }

    renderSubmitNewPassButton() {
        if (this.state.isPasswordInputVisible) {
            if (Platform.OS === 'android') {
                return (
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#ffffff')}
                        delayPressIn={0}
                        onPress={this._submitNewPassButtonInAsync}
                        underlayColor='#fff'>
                        <View style={styles.loginScreenButton}>
                            <Text style={styles.loginText}>SUBMIT</Text>
                        </View>
                    </TouchableNativeFeedback>
                )
            } else {
                return (
                    <TouchableHighlight
                        onPress={this._submitNewPassButtonInAsync}
                        underlayColor='#fff'>
                        <View style={styles.loginScreenButton}>
                            <Text style={styles.loginText}>SUBMIT</Text>
                        </View>
                    </TouchableHighlight>
                )
            }
        }
    }

    renderSendOTPButton() {
        if (!this.state.isOTPInputVisible) {
            if (Platform.OS === 'android') {
                return (
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#ffffff')}
                        delayPressIn={0}
                        onPress={this._sendOTPInAsync}
                        underlayColor='#fff'>
                        <View style={styles.loginScreenButton}>
                            <Text style={styles.loginText}>{this.state.isOTPInputVisible ? 'RESEND OTP' : 'SEND OTP'}</Text>
                        </View>
                    </TouchableNativeFeedback>
                )
            } else {
                return (
                    <TouchableHighlight
                        onPress={this._sendOTPInAsync}
                        underlayColor='#fff'>
                        <View style={styles.loginScreenButton}>
                            <Text style={styles.loginText}>{this.state.isOTPInputVisible ? 'RESEND OTP' : 'SEND OTP'}</Text>
                        </View>
                    </TouchableHighlight>
                )
            }
        }
    }

    _sendOTPInAsync = () => {

        if (this.state.mobileNumber.length != 10) {
            this.refs.toast.show('Please Enter a valid Mobile Number', 2000);
            return;
        }
        this.setState({ showProgressSpinner: true });
        let mobileNumber = "91" + this.state.mobileNumber;
        let reqBody = {
            "MobileNumber": mobileNumber
        }
        this.props.forgotPassword(reqBody).then((data) => {
            this.setState({ showProgressSpinner: false })
            if (data.Status == 200) {
                this.setState({ isOTPInputVisible: true });
                this.refs.toast.show(data.Message, 2000);
            } else {
                this.refs.toast.show(data.Message, 2000);
            }
        }).catch((err) => {
            this.setState({ showProgressSpinner: false })
            this.refs.toast.show('Something went wrong try again later !!!!', 2000);
        })
    };

    _verifyOTPInAsync = () => {

        if (!(this.state.otp)) {
            this.refs.toast.show('Please Enter a valid OTP', 2000);
            return;
        }
        this.setState({ showProgressSpinner: true })
        let mobileNumber = "91" + this.state.mobileNumber;
        let reqBody = {
            "MobileNumber": mobileNumber,
            "OTP": this.state.otp
        }
        this.props.verifyPassengerOTP(reqBody).then((data) => {
            this.setState({ showProgressSpinner: false })
            if (data.Status == 200) {
                this.setState({ isPasswordInputVisible: true })
                this.refs.toast.show(data.Message, 2000);
            } else {
                this.refs.toast.show(data.Message, 2000);
            }
        }).catch((err) => {
            this.setState({ showProgressSpinner: false })
            this.refs.toast.show('Something went wrong try again later !!!!', 2000);
        })
    }

    _submitNewPassButtonInAsync = () => {
        if (!(this.state.newPassword)) {
            this.refs.toast.show('Please Enter a valid Password', 2000);
            return;
        }
        this.setState({ showProgressSpinner: true })
        let mobileNumber = "91" + this.state.mobileNumber;
        let reqBody = {
            "MobileNumber": mobileNumber,
            "PIN": this.state.newPassword
        }
        this.props.createPassengerPin(reqBody).then((data) => {
            this.setState({ showProgressSpinner: false })
            if (data.Status == 200) {
                this.setState({ isPasswordInputVisible: true })
                this.refs.toast.show(data.Message, 2000);
                this.props.navigation.goBack();
            } else {
                this.refs.toast.show(data.Message, 2000);
            }
        }).catch((err) => {
            this.setState({ showProgressSpinner: false })
            this.refs.toast.show('Something went wrong try again later !!!!', 2000);
        })
    }

}

const mapStateToProps = state => ({
    profile: state.profile
});

const mapDispatchToProps = dispatch => ({
    forgotPassword: (reqBody) => dispatch(forgotPassword(reqBody)),
    verifyPassengerOTP: (reqBody) => dispatch(verifyPassengerOTP(reqBody)),
    createPassengerPin: (reqBody) => dispatch(createPassengerPin(reqBody))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPassScreen);

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
        zIndex: 999,
        backgroundColor: '#000000',
        opacity: 0.5
    },
    container: {
        flex: 1,
        // paddingTop: 15,
        backgroundColor: '#eaeaea'
    },
    mobileInputStyle: {
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#CA6C39',
    },
    email: {
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#CA6C39'
    },
    otpInput: {
        marginTop: 15,
        marginLeft: 15,
        marginRight: 12
    },
    input: {
        borderWidth: 1,
        borderColor: '#CA6C39'
    },
    headerBody: {
        flex: 0.4
    },
    textBody: {
        alignSelf: "center",
        color: "white",
        width: 150
    },
    header: {
        backgroundColor: "#CA6C39",
        height: 100,
    },
    bodyContent: {
        flex: 1
    },
    loginScreenButton: {
        marginRight: 12,
        marginLeft: 13,
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
    statusBar: {
        backgroundColor: "#A3552A",
        height: Constants.statusBarHeight,
    }
});
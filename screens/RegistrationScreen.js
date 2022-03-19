import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, View, StatusBar, Button, AsyncStorage, FlatList, ActivityIndicator } from 'react-native';
import { Header, Left, Container, Body, Title, Right, Icon, Content, Input, Item, Card, DatePicker, Label } from "native-base";
import { SendNewPassengerOTP, verifyPassengerOTP, Signup } from "../actions";
import { connect } from "react-redux";
// import { Constants } from 'expo';
import Constants from 'expo-constants'
import Toast, { DURATION } from 'react-native-easy-toast'

class RegistrationScreen extends React.Component {

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
            AppSignInPIN: "",
            showProgressSpinner: false,
            otpVerifyMobileTextVisible: true,
            "CustomerName": "",
            "PassengerName": "",
            "CustEmployeeId": "",
            "Gender": 1,
            "CostCenterCode": "",
            "PassengerEMail": "",
            "ManagerEMail": "",
            "SecretaryMobile": "",
            "SecretaryEMail": "",
            "CostCenterCode": ""
        }
    }

    onChange(which, value) {
        this.setState({ [which]: value });
    };

    render() {

        return (
            <View style={styles.container}>
                {/* <View style={styles.statusBar} /> */}
                {/* <StatusBar translucent={false} /> */}
                <Header
                    androidStatusBarColor={"#CA6C39"}
                    style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>
                    <Body style={styles.headerBody}>
                        <Title style={styles.textBody}>Registration</Title>
                    </Body>
                </Header>
                {this.renderSignUpScreen()}
            </View>
        );
    }

    renderSignUpScreen() {

        if (!this.state.otpVerifyMobileTextVisible) {
            return (
                <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps={"handled"}>
                    <View style={styles.bodyContent}>
                        {this.state.showProgressSpinner &&
                            <View style={styles.loading}>
                                <ActivityIndicator animating={true} size='large' color="black" />
                            </View>
                        }
                        <Toast ref="toast" positionValue={400} opacity={0.8} />
                        <Item floatingLabel style={styles.email}>
                            <Label>Passenger Name</Label>
                            <Input
                                style={styles.input}
                                value={this.state.PassengerName}
                                onChangeText={this.onChange.bind(this, 'PassengerName')}
                            />
                        </Item>
                        <Item floatingLabel style={styles.email}>
                            <Label>Customer Name</Label>
                            <Input
                                style={styles.input}
                                value={this.state.CustomerName}
                                onChangeText={this.onChange.bind(this, 'CustomerName')}
                            />
                        </Item>
                        <Item floatingLabel style={styles.email}>
                            <Label>App SignIn PIN</Label>
                            <Input
                                style={styles.input}
                                value={this.state.AppSignInPIN}
                                onChangeText={this.onChange.bind(this, 'AppSignInPIN')}
                            />
                        </Item>
                        <Item floatingLabel style={styles.email}>
                            <Label>Cust EmployeeId</Label>
                            <Input
                                style={styles.input}
                                value={this.state.CustEmployeeId}
                                onChangeText={this.onChange.bind(this, 'CustEmployeeId')}
                            />
                        </Item>
                        <Item floatingLabel style={styles.email}>
                            <Label>Cost Center Code</Label>
                            <Input
                                style={styles.input}
                                value={this.state.CostCenterCode}
                                onChangeText={this.onChange.bind(this, 'CostCenterCode')}
                            />
                        </Item>
                        <Item floatingLabel style={styles.email}>
                            <Label>Passenger EMail</Label>
                            <Input
                                style={styles.input}
                                value={this.state.PassengerEMail}
                                onChangeText={this.onChange.bind(this, 'PassengerEMail')}
                            />
                        </Item>
                        <Item floatingLabel style={styles.email}>
                            <Label>Mobile Number</Label>
                            <Input
                                disabled
                                style={styles.input}
                                value={this.state.mobileNumber}
                                onChangeText={this.onChange.bind(this, 'mobileNumber')}
                            />
                        </Item>
                        <Item floatingLabel style={styles.email}>
                            <Label>Manager EMail</Label>
                            <Input
                                style={styles.input}
                                value={this.state.ManagerEMail}
                                onChangeText={this.onChange.bind(this, 'ManagerEMail')}
                            />
                        </Item>
                        <Item floatingLabel style={styles.email}>
                            <Label>Secretary Mobile</Label>
                            <Input
                                style={styles.input}
                                value={this.state.SecretaryMobile}
                                onChangeText={this.onChange.bind(this, 'SecretaryMobile')}
                            />
                        </Item>
                        <Item floatingLabel style={styles.email}>
                            <Label>Secretary EMail</Label>
                            <Input
                                style={styles.input}
                                value={this.state.SecretaryEMail}
                                onChangeText={this.onChange.bind(this, 'SecretaryEMail')}
                            />
                        </Item>
                        {this.renderRegisterButton()}
                    </View>
                </ScrollView>
            );
        } else {
            return (
                <View style={styles.bodyContent}>
                    {this.state.showProgressSpinner &&
                        <View style={styles.loading}>
                            <ActivityIndicator animating={true} size='large' color="black" />
                        </View>
                    }
                    <Toast ref="toast" positionValue={400} opacity={0.8} />
                    <Item style={styles.email} fixedLabel>
                        <Label style={{
                            fontWeight: "bold", borderLeftWidth: 1, borderTopWidth: 1, borderBottomWidth: 1,
                            borderColor: '#CA6C39', height: 50, lineHeight: 50, paddingLeft: 10
                        }}>+91</Label>
                        <Input
                            disabled={this.state.isOTPInputVisible}
                            style={styles.mobileInputStyle}
                            placeholder='Mobile Number'
                            value={this.state.mobileNumber}
                            onChangeText={this.handleMobileNumberChange}
                        />
                    </Item>
                    {this.renderOTPInput()}
                    {this.renderSendOTPButton()}
                    {this.renderVerifyOTPButton()}
                </View>
            );
        }
    }

    renderRegisterButton() {

        if (Platform.OS === 'android') {
            return (
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#ffffff')}
                    delayPressIn={0}
                    onPress={this._submitNewRegistrationInAsync}
                    underlayColor='#fff'>
                    <View style={styles.loginScreenButton}>
                        <Text style={styles.loginText}>REGISTER</Text>
                    </View>
                </TouchableNativeFeedback>
            )
        } else {
            return (
                <TouchableHighlight
                    onPress={this._submitNewRegistrationInAsync}
                    underlayColor='#fff'>
                    <View style={styles.loginScreenButton}>
                        <Text style={styles.loginText}>REGISTER</Text>
                    </View>
                </TouchableHighlight>
            )
        }
    }

    renderOTPInput() {
        if (this.state.isOTPInputVisible) {
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

    renderVerifyOTPButton() {
        if (this.state.isOTPInputVisible) {
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
        this.props.SendNewPassengerOTP(reqBody).then((data) => {
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
        this.setState({ showProgressSpinner: true });
        let mobileNumber = "91" + this.state.mobileNumber;
        let reqBody = {
            "MobileNumber": mobileNumber,
            "OTP": this.state.otp
        }
        this.props.verifyPassengerOTP(reqBody).then((data) => {
            this.setState({ showProgressSpinner: false })
            if (data.Status == 200) {
                this.setState({ otpVerifyMobileTextVisible: false, isOTPInputVisible: false })
                this.refs.toast.show(data.Message, 2000);
            } else {
                this.refs.toast.show(data.Message, 2000);
            }
        }).catch((err) => {
            this.setState({ showProgressSpinner: false })
            this.refs.toast.show('Something went wrong try again later !!!!', 2000);
        })
    }

    _submitNewRegistrationInAsync = () => {

        if (this.validateSignUpData()) {
            return;
        }
        this.setState({ showProgressSpinner: true });
        let mobileNumber = "91" + this.state.mobileNumber;
        let reqBody = {
            "CustomerName": this.state.CustomerName,
            "PassengerName": this.state.PassengerName,
            "CustEmployeeId": this.state.CustEmployeeId,
            "Gender": 1,
            "PassengerMobile": mobileNumber,
            "CostCenterCode": this.state.CostCenterCode,
            "PassengerEMail": this.state.PassengerEMail,
            "ManagerEMail": this.state.ManagerEMail,
            "SecretaryMobile": this.state.SecretaryMobile,
            "AppSignInPIN": this.state.AppSignInPIN,
            "SecretaryEMail": this.state.SecretaryEMail
        }


        if (!(this.state.SecretaryMobile)) {
            delete reqBody.SecretaryMobile
        }

        if (!(this.state.SecretaryEMail)) {
            delete reqBody.SecretaryEMail
        }

        // console.log("req  Body --" + JSON.stringify(reqBody));

        this.props.Signup(reqBody).then((data) => {
            this.setState({ showProgressSpinner: false })
            // console.log("data ---" + JSON.stringify(data));

            if (data.Status == 200) {
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

    validateSignUpData() {
        if (!(this.state.AppSignInPIN)) {
            this.refs.toast.show('Please Enter a valid Password', 2000);
            return true;
        }

        if (!(this.state.CustomerName)) {
            this.refs.toast.show('Please Enter a valid CustomerName', 2000);
            return true;
        }

        if (!(this.state.PassengerName)) {
            this.refs.toast.show('Please Enter a valid PassengerName', 2000);
            return true;
        }

        if (!(this.state.CustEmployeeId)) {
            this.refs.toast.show('Please Enter a valid CustEmployeeId', 2000);
            return true;
        }

        if (!(this.state.Gender)) {
            this.refs.toast.show('Please Enter a valid Gender', 2000);
            return true;
        }

        if (!(this.state.CostCenterCode)) {
            this.refs.toast.show('Please Enter a valid CostCenterCode', 2000);
            return true;
        }
        if (!(this.state.PassengerEMail)) {
            this.refs.toast.show('Please Enter a valid PassengerEMail', 2000);
            return true;
        }
        if (!(this.state.ManagerEMail)) {
            this.refs.toast.show('Please Enter a valid ManagerEMail', 2000);
            return true;
        }

        if (!(this.state.CostCenterCode)) {
            this.refs.toast.show('Please Enter a valid CostCenterCode', 2000);
            return true;
        }
    }

}

const mapStateToProps = state => ({
    profile: state.profile
});

const mapDispatchToProps = dispatch => ({
    SendNewPassengerOTP: (reqBody) => dispatch(SendNewPassengerOTP(reqBody)),
    verifyPassengerOTP: (reqBody) => dispatch(verifyPassengerOTP(reqBody)),
    Signup: (reqBody) => dispatch(Signup(reqBody))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationScreen);

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
    contentContainer: {
        flexGrow: 1,
        backgroundColor: '#eaeaea'
    },
    container: {
        flex: 1,
        // paddingTop: 15,
        backgroundColor: '#eaeaea'
    },
    email: {
        marginTop: 10,
        marginLeft: 15,
        marginRight: 12
    },
    otpInput: {
        marginTop: 15,
        marginLeft: 15,
        marginRight: 12
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#CA6C39'
    },
    mobileInputStyle: {
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#CA6C39',
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
        borderColor: '#fff',
        marginBottom: 250
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
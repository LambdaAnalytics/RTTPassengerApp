import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
    Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity,
    TouchableNativeFeedback, TouchableHighlight, View, StatusBar, Button,
    AsyncStorage, FlatList, ActivityIndicator, Switch
} from 'react-native';
import {
    Header, Left, Container, Body, Title, Right, Icon,
    Content, Input, Item, Card, DatePicker, Label
} from "native-base";
import { fetchProfileDataForPromise, getApproverDetails, updateApproverDetails } from "../actions";
import { connect } from "react-redux";
// import { Constants } from 'expo';
import Constants from 'expo-constants'
import Toast, { DURATION } from 'react-native-easy-toast'

class EditProfileScreen extends React.Component {

    static navigationOptions = {
        headerShown: false
    };

    constructor() {
        super();
        this.state = {
            type: "",
            isFetchingProfileData: false,
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
            "CostCenterCode": "",
            "ApproverMobileNo": "",
            "ApproverName": "",
            "ApproverEmail": "",
            "ApproverEmailDisableField": false

        }
    }

    componentDidMount() {
        // console.log("this.props.auth ---" + JSON.stringify(this.props.auth));
        this.setState({ showProgressSpinner: true });
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        this.setState({ type: type });
        // console.log("type ---", type);
        this.props.fetchProfileDataForPromise(this.props.auth.token.MobileNo1).then((data) => {
            // console.log("----" + JSON.stringify(data));
            if (data.Status == 200) {
                // console.log("---- 111");
                this.setState({
                    "CustomerName": data.PassengerProfile.CustomerName,
                    "PassengerName": data.PassengerProfile.PassengerName,
                    "CustEmployeeId": data.PassengerProfile.CustEmployeeId,
                    "Gender": data.PassengerProfile.Gender,
                    "CostCenterCode": data.PassengerProfile.CostCenterCode,
                    "PassengerEMail": data.PassengerProfile.PassengerEMail,
                    "ManagerEMail": data.PassengerProfile.ManagerEMail,
                    "SecretaryMobile": data.PassengerProfile.SecretaryMobileNo ? data.PassengerProfile.SecretaryMobileNo.substring(2) : "",
                    "SecretaryEMail": data.PassengerProfile.SecretaryEmail,
                    "CostCenterCode": data.PassengerProfile.CostCenterCode,
                    "ApproverMobileNo": data.PassengerProfile.ApproverMobileNo ? data.PassengerProfile.ApproverMobileNo.substring(2) : "",
                    "ApproverName": data.PassengerProfile.ApproverName,
                    "ApproverEmail": data.PassengerProfile.ApproverEmail,
                    "mobileNumber": data.PassengerProfile.MobileNo1 ? data.PassengerProfile.MobileNo1.substring(2) : ""
                })
            }
            // this.refs.toast.show(data.Message);
        }).catch((err) => {
            this.refs.toast.show('Failure');
        }).finally(() => {
            this.setState({ showProgressSpinner: false })
        });
    }

    onChange(which, value) {
        this.setState({ [which]: value });
    };

    onSupervisorMobileChange(value) {
        // console.log("value ----", value.length);
        // console.log(value.length == 10);
        // console.log(value.length > 10);
        let ApproverMobileNo = value;
        // if (ApproverMobileNo.length == 1) {
        //     ApproverMobileNo = "91" + this.state.ApproverMobileNo
        // }
        this.setState({ ApproverMobileNo: ApproverMobileNo });
        if (ApproverMobileNo.length == 10) {
            this.getApproverDetails(ApproverMobileNo);
        } else if (ApproverMobileNo.length > 10) {
            this.refs.toast.show('Supervisor Mobile Number Should be 10 digit Number');
        }
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
                        <Title style={styles.textBody}>{this.state.type == '2' ? 'Edit Profile' : 'Edit Reporting Manager'}</Title>
                    </Body>
                </Header>
                {this.renderSignUpScreen()}
            </View>
        );
    }

    renderSignUpScreen() {


        return (
            <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps={"handled"}>
                <View style={styles.bodyContent}>
                    {this.state.showProgressSpinner &&
                        <View style={styles.loading}>
                            <ActivityIndicator animating={true} size='large' color="black" />
                        </View>
                    }
                    <Toast ref="toast" positionValue={400} opacity={0.8} />
                    {/*  <Item floatingLabel style={styles.email}>
                        <Label>Passenger Name</Label>
                        <Input
                            disabled
                            style={styles.input}
                            value={this.state.PassengerName}
                            onChangeText={this.onChange.bind(this, 'PassengerName')}
                        />
                    </Item>
                    <Item floatingLabel style={styles.email}>
                        <Label>Customer Name</Label>
                        <Input
                            disabled
                            style={styles.input}
                            value={this.state.CustomerName}
                            onChangeText={this.onChange.bind(this, 'CustomerName')}
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
                    <View style={styles.toggleButtonStyle}>
                        <View>
                            <Text style={{ fontSize: 17, marginLeft: 5, color: '#707070' }}>Approval Required</Text>
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
                    {this.renderSupervisorUIScreen()}
                    {this.renderRegisterButton()}
                </View>
            </ScrollView>
        );
    }

    renderRegisterButton() {

        if (Platform.OS === 'android') {
            return (
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#ffffff')}
                    delayPressIn={0}
                    onPress={this.updateApproverDetails}
                    underlayColor='#fff'>
                    <View style={styles.loginScreenButton}>
                        <Text style={styles.loginText}>UPDATE</Text>
                    </View>
                </TouchableNativeFeedback>
            )
        } else {
            return (
                <TouchableHighlight
                    onPress={this.updateApproverDetails}
                    underlayColor='#fff'>
                    <View style={styles.loginScreenButton}>
                        <Text style={styles.loginText}>UPDATE</Text>
                    </View>
                </TouchableHighlight>
            )
        }
    }

    renderSupervisorUIScreen() {
        if (this.state.type == "1") {
            return (
                <View>
                    <Text style={{
                        marginLeft: 15, color: '#878787',
                        fontSize: 16, marginBottom: 0, marginTop: 5
                    }}>Manager Mobile Number</Text>
                    <Item fixedLabel style={styles.email}>
                        <Label style={{
                            fontWeight: "bold", height: 50, lineHeight: 50, paddingLeft: 10, flex: 0.4
                        }}>+91</Label>
                        <Input
                            placeholder="Manager Mobile Number"
                            style={styles.input}
                            value={this.state.ApproverMobileNo}
                            onChangeText={this.onSupervisorMobileChange.bind(this)}
                        />
                    </Item>
                    <Item floatingLabel style={styles.email}>
                        <Label>Reporting Manager Name</Label>
                        <Input
                            disabled
                            style={styles.input}
                            value={this.state.ApproverName}
                            onChangeText={this.onChange.bind(this, 'ApproverName')}
                        />
                    </Item>
                    <Item floatingLabel style={styles.email}>
                        <Label>Reporting Manager Email</Label>
                        <Input
                            disabled={this.state.ApproverEmailDisableField}
                            style={styles.input}
                            value={this.state.ApproverEmail}
                            onChangeText={this.onChange.bind(this, 'ApproverEmail')}
                        />
                    </Item>
                </View>
            );
        } else if (this.state.type == "2") {
            return (
                <View>
                    <Item floatingLabel style={styles.email}>
                        <Label>Passenger Name</Label>
                        <Input
                            disabled
                            style={styles.input}
                            value={this.state.PassengerName}
                            onChangeText={this.onChange.bind(this, 'PassengerName')}
                        />
                    </Item>
                    <Item floatingLabel style={styles.email}>
                        <Label>Customer Name</Label>
                        <Input
                            disabled
                            style={styles.input}
                            value={this.state.CustomerName}
                            onChangeText={this.onChange.bind(this, 'CustomerName')}
                        />
                    </Item>
                    <Text style={{
                        marginLeft: 15, color: '#878787',
                        fontSize: 16, marginBottom: 0, marginTop: 5
                    }}>Passenger Mobile Number</Text>
                    <Item fixedLabel style={styles.seceratery_mobile}>
                        <Label style={{
                            fontWeight: "bold", height: 50, lineHeight: 50, paddingLeft: 10, flex: 0.4
                        }}>+91</Label>
                        <Input
                            disabled
                            placeholder="Enter Passenger Mobile Number"
                            style={styles.input}
                            value={this.state.mobileNumber}
                            onChangeText={this.onChange.bind(this, 'mobileNumber')}
                        />
                    </Item>
                    <Text style={{
                        marginLeft: 15, color: '#878787',
                        fontSize: 16, marginBottom: 0, marginTop: 5
                    }}>Secretary Mobile Number</Text>
                    <Item fixedLabel style={styles.seceratery_mobile}>
                        <Label style={{
                            fontWeight: "bold", height: 50, lineHeight: 50, paddingLeft: 10, flex: 0.4
                        }}>+91</Label>
                        <Input
                            placeholder="Enter Secretary Mobile Number"
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
                </View>
            )
        }
    }

    getApproverDetails = (value) => {

        this.setState({ showProgressSpinner: true });
        let mobileNumber = "91" + value;
        let reqBody = {
            "CustomerId": this.props.auth.token.CustomerId + "",
            "MobileNo": mobileNumber
        }

        // console.log("req  Body --" + JSON.stringify(reqBody));

        this.props.getApproverDetails(reqBody).then((data) => {
            // console.log("data ---" + JSON.stringify(data));
            if (data.Status == 200) {
                this.setState({
                    showProgressSpinner: false, ApproverEmail: data.EMailId,
                    ApproverName: data.FullName
                })
                if (data.EMailId != null) {
                    this.setState({ ApproverEmailDisableField: true })
                }
                // this.refs.toast.show(data.Message, 4000);
            } else {
                this.setState({ showProgressSpinner: false, ApproverEmail: "", ApproverName: "" })
                this.refs.toast.show(data.Message, 4000);
            }
        }).catch((err) => {
            this.setState({ showProgressSpinner: false, ApproverEmail: "", ApproverName: "" })
            this.refs.toast.show('Something went wrong try again later !!!!', 4000);
        })
    }

    updateApproverDetails = () => {

        if (this.validateSignUpData()) {
            return;
        }
        this.setState({ showProgressSpinner: true });

        let tempApproverMobileNo = "91" + this.state.ApproverMobileNo;
        let tempSecretaryMobile = "91" + this.state.SecretaryMobile;
        let reqBody = {
            "PassengerId": this.props.auth.token.PassengerId,
            "ApproverMobileNo": tempApproverMobileNo == "91" ? null : tempApproverMobileNo,
            "ApproverEMail": this.state.ApproverEmail,
            "SecretaryMobileNo": tempSecretaryMobile == "91" ? null : tempSecretaryMobile,
            "SecretaryEMail": this.state.SecretaryEMail,
            "BkgApprovalRequired": this.props.auth.token.BkgApprovalRequired ? true : false
        }

        // console.log("reqBody ---" + JSON.stringify(reqBody));


        this.props.updateApproverDetails(reqBody).then((data) => {

            // console.log("data ---" + JSON.stringify(data));

            this.setState({ showProgressSpinner: false })

            if (data.Status == 200) {
                // console.log("data -11--")
                this.props.navigation.goBack();
                this.refs.toast.show(data.Message, 4000);
            } else {
                this.refs.toast.show(data.Message, 4000);
            }
        }).catch((err) => {
            this.setState({ showProgressSpinner: false })
            this.refs.toast.show('Something went wrong try again later !!!!', 4000);
        })
    }

    validateSignUpData() {
        // if (!(this.state.ApproverMobileNo)) {
        //     this.refs.toast.show('Please Enter a valid Supervisor Mobile', 4000);
        //     return true;
        // }

        // if (!(this.state.ApproverEmail)) {
        //     this.refs.toast.show('Please Enter a valid Supervisor Email', 4000);
        //     return true;
        // }
    }

}

const mapStateToProps = state => ({
    profile: state.profile,
    isFetching: state.profile.isFetching,
    auth: state.auth
});

const mapDispatchToProps = dispatch => ({
    fetchProfileDataForPromise: (mobileNo) => dispatch(fetchProfileDataForPromise(mobileNo)),
    getApproverDetails: (reqBody) => dispatch(getApproverDetails(reqBody)),
    updateApproverDetails: (reqBody) => dispatch(updateApproverDetails(reqBody))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditProfileScreen);

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
    seceratery_mobile: {
        marginLeft: 15,
        marginRight: 12,
        marginTop: 0
    },
    otpInput: {
        marginTop: 15,
        marginLeft: 15,
        marginRight: 12
    },
    input: {
    },
    mobileInputStyle: {
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#CA6C39',
    },
    headerBody: {
        flex: 0.8
    },
    textBody: {
        alignSelf: "center",
        color: "white",
        width: 250
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
        marginBottom: 280
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
    },
    toggleButtonStyle: {
        flexDirection: 'row',
        paddingRight: 12,
        paddingTop: 12,
        paddingLeft: 12,
        paddingBottom: 6
    }
});
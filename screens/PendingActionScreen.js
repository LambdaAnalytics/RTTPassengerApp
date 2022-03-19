import React from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
    Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableHighlight,
    View, StatusBar, Button, AsyncStorage, FlatList, ActivityIndicator, TouchableNativeFeedback, Modal
} from 'react-native';
import { Header, Left, Container, Body, Title, Right, Icon, Content, Input, Item, Card, DatePicker, Label } from "native-base";
import { connect } from "react-redux";
import { userRequestLogout, fetchBookingList, rejectAppBooking } from "../actions";
import { MaterialIcons } from '@expo/vector-icons'
import Toast, { DURATION } from 'react-native-easy-toast'

// const extractKey = ({ JourneyDate }) => JourneyDate + "";
const extractKey = ({ }) => Math.random().toString(36).substring(7);
const { width, height } = Dimensions.get('window');

class PendingActionScreen extends React.Component {

    static navigationOptions = {
        headerShown: false
    };

    /* static navigationOptions = {
      title: 'Details',
      headerStyle: {
        backgroundColor: '#f4511e',
      }
    }; */

    /* headerTitle:
    <View style={{ backgroundColor: "#CA6C39", flex: 1 }}>
      <Header
        androidStatusBarColor={"#CA6C39"}
        style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>
        <Body style={{ flex: 0.4 }}>
          <Title style={{
            alignSelf: "center",
            color: "white"
          }}>My Bookings</Title>
        </Body>
      </Header>
    </View> */

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRefreshing: false,
            modalVisible: false,
            comment: '',
            selectedItem: {}
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', (route) => {
            // console.log("tab changed ", route);
            this.props.fetchBookingList({ "bookingType": "4", "userMobile": this.props.auth.token.MobileNo1 });
        });
    }

    _onRefresh() {
        // console.log("refreshing");
        this.props.fetchBookingList({ "bookingType": "4", "userMobile": this.props.auth.token.MobileNo1 });
    }

    renderRejectButton(item) {

        if (Platform.OS === 'android') {
            return (
                <View style={styles.acceptDiscloserViewStyle}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#CA6C39')}
                        style={styles.acceptTouchableButtonStyle}
                        delayPressIn={0}
                        onPress={() => this._onRejectClick(item)}
                        underlayColor='#fff'>
                        <Text style={{ color: '#ffffff' }}>Reject</Text>
                    </TouchableNativeFeedback>
                </View>
            )
        } else {
            return (
                <View style={styles.acceptDiscloserViewStyle}>
                    <TouchableHighlight
                        onPress={() => this._onRejectClick(item)}
                        style={styles.acceptTouchableButtonStyle}
                        underlayColor='#fff'>
                        <Text style={{ color: '#ffffff' }}>Reject</Text>
                    </TouchableHighlight>
                </View>
            )
        }
    }

    renderItem = ({ item }) => {
        if (item && item.TripToAddress && item.TripToAddress != "") {
            return (
                <Card style={styles.row}>
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
                    <View
                        style={{
                            borderBottomColor: '#CA6C39',
                            borderBottomWidth: 1,
                            marginTop: 2,
                            marginBottom: 2
                        }}
                    />
                    <View>
                        <View style={styles.info}>
                            <View style={{ flex: 1.3 }}>
                                <Text> Customer's Name </Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text> {item.CustomerName} </Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.info}>
                            <View style={{ flex: 1.3 }}>
                                <Text> Journey Date </Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text> {item.CustAppJourneyDateTime} </Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.info}>
                            <View style={{ flex: 1.3 }}>
                                <Text> City Of Journey </Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text> {item.CityOfJourney} </Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.info}>
                            <View style={{ flex: 1.3 }}>
                                <Text> Booking Type </Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text> {item.PersonalBooking ? 'Personal Booking' : 'Official Booking'} </Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.info}>
                            <View style={{ flex: 1.3 }}>
                                <Text> Passenger's Name </Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text> {item.PassengerName} </Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.info}>
                            <View style={{ flex: 1.3 }}>
                                <Text> Passenger's Contact </Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text> {item.PassengerContactNo} </Text>
                            </View>
                        </View>
                    </View>
                    {this.renderRejectButton(item)}
                </Card>
            );
        } else {
            return (
                <Card style={styles.row}>
                    <View style={styles.contentRow}>
                        {/* <Text style={styles.row_time}>{this.formatDate(item.JourneyDate)}</Text> */}
                        <View>
                            <View style={styles.row_time}>
                                <View style={{ flex: 1.3 }}>
                                    <Text style={{ fontWeight: 'bold' }}>{this.formatDate(item.JourneyDate)}</Text>
                                </View>
                                <View style={{ flex: 2, alignItems: 'flex-end' }}>
                                    <Text style={{ color: this.getColorForStatus(item.BookingStatusName) }}>{item.BookingStatusName ? item.BookingStatusName : ''} </Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#CA6C39',
                                borderBottomWidth: 1,
                                marginTop: 2,
                                marginBottom: 2
                            }}
                        />
                        <View style={styles.row_cell_places}>
                            <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="adjust" />
                            <Text style={styles.row_place}>{item.PickupAddress}</Text>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#d6d6d6',
                                borderBottomWidth: 1,
                                marginTop: 2,
                                marginBottom: 2
                            }}
                        />
                        <View>
                            <View style={styles.info}>
                                <View style={{ flex: 1.3 }}>
                                    <Text> Customer's Name </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text> {item.CustomerName} </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={styles.info}>
                                <View style={{ flex: 1.3 }}>
                                    <Text> Journey Date </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text> {item.CustAppJourneyDateTime} </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={styles.info}>
                                <View style={{ flex: 1.3 }}>
                                    <Text> City Of Journey </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text> {item.CityOfJourney} </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={styles.info}>
                                <View style={{ flex: 1.3 }}>
                                    <Text> Booking Type </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text> {item.PersonalBooking ? 'Personal Booking' : 'Official Booking'} </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={styles.info}>
                                <View style={{ flex: 1.3 }}>
                                    <Text> Passenger's Name </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text> {item.PassengerName} </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={styles.info}>
                                <View style={{ flex: 1.3 }}>
                                    <Text> Passenger's Contact </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text> {item.PassengerContactNo} </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {this.renderRejectButton(item)}

                </Card>
            )

        }
    }

    getColorForStatus(status) {
        if (status) {
            switch (status) {
                case "Booking Created":
                    return '#000000';

                case "Booking Accepted":
                    return '#CA6C39';

                case "Trip In Progress":
                    return 'green';

                case "Trip Closed":
                    return 'blue';

                case "Trip Cancelled":
                    return 'red';

                case "No Show":
                    return 'red';

                case "Trip Rejected":
                    return 'red';

            }
        }

        return '#000000'
    }

    render() {


        if (this.props.isFetching4) {
            return (
                <View style={styles.center}>
                    <Toast ref="toast" positionValue={400} opacity={0.8} />
                    <ActivityIndicator animating={true} />
                </View>
            )
        }

        if (this.state.isLoading) {
            return (
                <View style={styles.center}>
                    <Toast ref="toast" positionValue={400} opacity={0.8} />
                    <ActivityIndicator animating={true} />
                </View>
            )
        }

        resp = this.props.bookings.bookingListResp4;
        // console.log("this.props.bookings.bookingListResp.BookingList ==== " + JSON.stringify(resp.bookingListResp2));

        if (resp && resp.BookingList && resp.BookingList.length == 0) {
            return (
                <View style={styles.center}>
                    <Toast ref="toast" positionValue={400} opacity={0.8} />
                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '200', flex: 1, marginTop: 200 }}>No Records Found !!!</Text>
                </View>
            )
        } else if (!resp || !resp.BookingList) {
            return (
                <View style={styles.center}>
                    <Toast ref="toast" positionValue={400} opacity={0.8} />
                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '200', flex: 1, marginTop: 200 }}>Something Went Wrong. Try Again Later !!!!</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <Toast ref="toast" positionValue={400} opacity={0.8} />
                <FlatList
                    style={styles.listContainer}
                    data={resp.BookingList}
                    renderItem={this.renderItem}
                    keyExtractor={extractKey}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh.bind(this)}
                />
                <View>
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
                            <View style={{ width: 300, height: 130, backgroundColor: '#fff' }}>
                                <View style={{ margin: 10 }}>
                                    <View style={{ marginTop: 10, marginRight: 10 }}>
                                        <Item stackedLabel>
                                            <Label style={{ marginLeft: 6, fontWeight: "bold", width: "100%" }}>Reason For Rejection</Label>
                                            <Input
                                                placeholder="Comment"
                                                name="Reason For Rejection"
                                                value={this.state.comment}
                                                onChangeText={this.handleCommentChange}
                                            />
                                        </Item>
                                    </View>
                                </View>
                                <View style={styles.acceptDiscloserViewStyle}>
                                    <View style={styles.acceptTouchableButtonLeftStyle}>
                                        <TouchableHighlight
                                            onPress={() => {
                                                this.onAcceptDisclosureClick();
                                            }}>
                                            <Text style={{ color: '#ffffff' }}>Reject</Text>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.acceptTouchableButtonRightStyle}>
                                        <TouchableHighlight
                                            onPress={() => {
                                                this.onCloseClick();
                                            }}>
                                            <Text style={{ color: '#ffffff' }}>Cancel</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        );

    }

    handleCommentChange = (comment) => this.setState({ comment });

    _onRejectClick = (item) => {
        this.setState({ modalVisible: true, selectedItem: item });
    }

    onCloseClick = async () => {
        this.setState({ modalVisible: false })
    };

    onAcceptDisclosureClick = async () => {
        // this.setState({ modalVisible: false });
        let item = this.state.selectedItem;
        let reqBody = {
            "BookingId": item.BookingId,
            "ApproverMobileNo": this.props.auth.token.MobileNo1,
            "BookingByAppType": item.Approved ? "3" : "2",
            "ReasonForRejection": this.state.comment
        }
        // console.log("----" + JSON.stringify(reqBody));
        this.setState({ isLoading: true, modalVisible: false })
        this.props.rejectAppBooking(reqBody).then((data) => {
            // console.log("----" + JSON.stringify(data));
            this.setState({ isLoading: false });
            this.refs.toast.show(data.Message);
            if (data.Status == 200) {
                this.props.fetchBookingList({ "bookingType": "4", "userMobile": this.props.auth.token.MobileNo1 });
            }
        }).catch((err) => {
            this.setState({ isLoading: false });
            this.refs.toast.show('Failure');
        })


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
}

const mapStateToProps = state => ({
    bookings: state.bookings,
    auth: state.auth,
    isFetching4: state.bookings.isFetching4
});

const mapDispatchToProps = dispatch => ({
    fetchBookingList: (data) => dispatch(fetchBookingList(data)),
    rejectAppBooking: (data) => dispatch(rejectAppBooking(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PendingActionScreen);

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
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 0,
        marginBottom: 2,
    }
    ,
    row: {
        flex: 1,
        flexDirection: 'column',  // main axis
        justifyContent: 'flex-start', // main axis
        // alignItems: 'center', // cross axis
    },
    row_cell_timeplace: {
        flex: 1,
        flexDirection: 'column',
    },
    row_cell_places: {
        flex: 1,
        flexDirection: 'row'
    },
    row_cell_temp: {
        color: "#000000",
        paddingLeft: 16,
        flex: 0,
        fontSize: 20
    },
    acceptDiscloserViewStyle: {
        height: 30,
        width: "100%",
        bottom: 0,
        backgroundColor: '#CA6C39',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        flexDirection: 'row'
    },
    acceptTouchableButtonRightStyle: {
        width: "50%",
        height: 30,
        backgroundColor: '#CA6C39',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1.3

    },
    acceptTouchableButtonLeftStyle: {
        width: "50%",
        height: 30,
        backgroundColor: '#CA6C39',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1.3

    },
    row_time: {
        fontSize: 16,
        color: "#000000",
        flexDirection: 'row',
        marginBottom: 5,
        fontWeight: "bold",
        textAlignVertical: 'bottom',
        includeFontPadding: false,
    },
    row_place: {
        color: "#000000",
        textAlignVertical: 'top',
        includeFontPadding: false,
        flex: 0,
        fontSize: 15
    },
    info: {
        fontSize: 16,
        color: "#000000",
        marginTop: 10,
        paddingBottom: 5,
        borderBottomColor: '#d6d6d6',
        borderBottomWidth: 1,
        flexDirection: 'row'
    }
});

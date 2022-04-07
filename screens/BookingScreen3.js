import React from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
    Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableHighlight,
    View, StatusBar, Button, AsyncStorage, FlatList, ActivityIndicator, TouchableNativeFeedback
} from 'react-native';
import { Header, Left, Container, Body, Title, Right, Icon, Content, Input, Item, Card, DatePicker, Label,Alert } from "native-base";
import { connect } from "react-redux";
import { userRequestLogout, fetchBookingList, getPaymentAmtForTrip, SendPaymentID } from "../actions";
import { MaterialIcons } from '@expo/vector-icons';
import RazorpayCheckout from 'react-native-razorpay';
import Modal from 'react-native-modal-patch';

// const extractKey = ({ JourneyDate }) => JourneyDate + "";
const extractKey = ({ }) => Math.random().toString(36).substring(7);
const { width, height } = Dimensions.get('window');

class BookingScreen3 extends React.Component {

    static navigationOptions = {
        headerShown: false
    };
    state = {
    modalVisible: false
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }


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
            isRefreshing: false,
            isPaymentInProgress: false,
            
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', (route) => {
            // console.log("tab changed ", route);
            this.props.fetchBookingList({ "bookingType": "3", "userMobile": this.props.auth.token.MobileNo1 });
        });
    }


    _onRefresh() {
       
        this.props.fetchBookingList({ "bookingType": "3", "userMobile": this.props.auth.token.MobileNo1 });
    }



    renderItem = ({ item }) => {

        if (Platform.OS === 'android') {
            return (
                
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#CA6C39')}
                    delayPressIn={0}
                    onPress={() => this._onBookingListItemClick(item)}
                    underlayColor='#fff'>
                    {this.renderToAndFrom(item)}
                </TouchableNativeFeedback>
            )
        } else {
            return (
                <TouchableHighlight
                    onPress={() => this._onBookingListItemClick(item)}
                    underlayColor='#fff'>
                    {this.renderToAndFrom(item)}
                </TouchableHighlight>
            )
        }
    }

    renderToAndFrom(item) {
        if (item && item.TripToAddress && item.TripToAddress != "") {
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
                                <Text> Trip ID </Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text> {item.BookingId ? item.BookingId : '-NA-'} </Text>
                            </View>
                        </View>
                    </View>
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
                          <Text> Vehicle Type </Text>
                        </View>
                             <View style={{ flex: 2 }}>
                             <Text> {item.CustRequestedVehicle} </Text>
                        </View>
                     </View>
                  </View>
                  {/*
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
                    </View>  */}
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
                        <View style={styles.row_cell_places}>
                            <MaterialIcons style={{ fontSize: 15, color: '#000000', marginTop: 1, marginRight: 5 }} name="adjust" />
                            <Text style={styles.row_place}>{item.PickupAddress}</Text>
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
                                    <Text> Trip ID </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text> {item.BookingId ? item.BookingId : '-NA-'} </Text>
                                </View>
                            </View>
                        </View>
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
                        </View><View>
                      <View style={styles.info}>
                        <View style={{ flex: 1.3 }}>
                          <Text> Vehicle Type </Text>
                        </View>
                             <View style={{ flex: 2 }}>
                             <Text> {item.CustRequestedVehicle} </Text>
                        </View>
                     </View>
                   </View>
                     {/*
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
                        */} 
                        <View>
                            <View style={styles.info}>
                                <View style={{ flex: 1.3 }}>
                                    <Text> Train / Flight No </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text> {item.Flight_TrainNo ? item.Flight_TrainNo : ' - '} </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={styles.info}>
                                <View style={{ flex: 1.3 }}>
                                    <Text> Vehicle No </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text> {item.VehicleNo ? item.VehicleNo : '-NA-'} </Text>
                                </View>
                            </View>
                        </View>
                        { item.ReasonForRejection &&
                        <View>
                            <View style={styles.info}>
                                <View style={{ flex: 1.3 }}>
                                    <Text>Reason For Rejection  </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text style={{ color: 'red' }}> {item.ReasonForRejection ? item.ReasonForRejection : '-NA-'} </Text>
                                </View>
                            </View>
                        </View>
                       }

                        <View style={styles.container}>  
                        {(this.state.isPaymentInProgress ) &&
                          <View style={styles.loading}>
                          <ActivityIndicator animating={true} size='large' color="black" />
                          </View>
        }

                        { item.PaymentStatus == false &&
                            
                           //   <TouchableHighlight onPress={this.onTripAmtPayment.bind(this, item)}>
                               <TouchableHighlight onPress={this.renderModalPopUp.bind(this, item)}> 
                               <View style={styles.button}>
                              <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '900', flex: 1 }}>PAY NOW</Text>
                      
                             </View>
                             </TouchableHighlight>
                        }
                       { item.PaymentStatus == true &&
                            <TouchableHighlight >
                               <View style={styles.button}>
                              <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '900', flex: 1 }} > {item.PaymentDetails} </Text>
                               </View>
                             </TouchableHighlight>

                        }
                      </View>
                    </View>
                </Card>
            )

        }
    }

    renderModalPopUp = (tripDetails) => {
       
        this.setModalVisible(true);
        console.log(" tripDetails ",tripDetails);
        return (
            <View style={styles.centeredView}>
             <Modal
                animationType="slide"
                presentationStyle="pageSheet" // <-- Swipe down/dismiss works now!
                visible={this.state.modalVisible}
                onDismiss={() => this.setModalVisible(false)} // <-- This gets called all the time
                >
                {" I am going to Bangalore "}
            </Modal>
            </View>
        );
    }

    onTripAmtPayment = (tripDetails) => {
        this.setState({
        isPaymentInProgress : true });
       
        this.props.getPaymentAmtForTrip({ "tripId": tripDetails.BookingId }).then((data) => {
             
           

        if (data.Status == 200) {
        //  this.resetAllFields();
        //  this.props.navigation.navigate("My Bookings");
         
          var options = {
            description: 'Credits towards consultation',
            image: 'https://app.royaltour.in/images/rtt_pg_logo.jpg',
            currency: 'INR',
            key: data.TripPaymentAmtDtls.rpkid,  
            amount: data.TripPaymentAmtDtls.Amount,
            name: 'Royal Tours & Travels',
            order_id: data.TripPaymentAmtDtls.Order_Id,//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
            prefill: {
            //  email: 'amarshotmail@gmail.com',
            //  contact: '7892419603',
            name: 'Vinayak Royal'
            },
            theme: {color: '#53a20e'}
          }

          this.setState({
            isPaymentInProgress : false });
           
    
          RazorpayCheckout.open(options).then((dataRPay) => {
            // handle success
            alert(" Thank You ! Payment Successful ");
          
            dataRPay.err_code = null;
            dataRPay.err_description = null;
            dataRPay.err_source = null;
            dataRPay.err_step = null;
            dataRPay.err_reason =  null;
            dataRPay.Status = "success";
           
           
            this.props.SendPaymentID(dataRPay).then((data) => {
                alert(" Success - Payment status Updated in DB ")
                this._onRefresh(); 
               // alert(JSON.stringify(data));
            });
            
           
          }).catch((error) => {

            alert(" Sorry ! Payment Unsuccessful ");
            
            let errorRespData = {};
            errorRespData.err_code = error.code;
            errorRespData.err_description = error.error.description;
            errorRespData.err_source = error.error.source;
            errorRespData.err_step = error.error.step;
            errorRespData.err_reason =  error.description.reason;
            errorRespData.Status = "Unsuccess";
           
            this.props.SendPaymentID(errorRespData).then((data) => {
             
                this._onRefresh(); 
              //  alert(JSON.stringify(data));
            });
        

            

          });

         } else {
            alert(data.Message+" - Contact Royal Tours & Travels");
            this.setState({
                isPaymentInProgress : false });
        }
      }).catch((err) => {
        //this.setState({ isNewBookingInProgress: false });
        alert('Failure');
      })  
       
        /*

        var options = {
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_test_hu7NnZwz7beSZy',  
        amount: '5',
        name: 'Royal Tours & Travels',
        order_id: 'order_G2wU9q1ILtd49J',//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
        prefill: {
          email: 'amarshotmail@gmail.com',
          contact: '7892419603',
          name: 'Vinayak Royal'
        },
        theme: {color: '#53a20e'}
      }

      RazorpayCheckout.open(options).then((data) => {
        // handle success
        alert(JSON.stringify(data)) ;
        alert(`Success: ${data}`);
      }).catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
      */


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


        if (this.props.isFetching3) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator animating={true} />
                </View>
            )
        }

        resp = this.props.bookings.bookingListResp3;
        // console.log("this.props.bookings.bookingListResp.BookingList ==333== " + JSON.stringify(resp));

        if (resp && resp.BookingList && resp.BookingList.length == 0) {
            return (
                <View style={styles.center}>
                    {/* <Toast ref="toast" positionValue={400} opacity={0.8} /> */}
                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '200', flex: 1, marginTop: 200 }}>No Records Found !!!</Text>
                </View>
            )
        } else if (!resp || !resp.BookingList) {
            return (
                <View style={styles.center}>
                    {/* <Toast ref="toast" positionValue={400} opacity={0.8} /> */}
                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '200', flex: 1, marginTop: 200 }}>Something Went Wrong. Try Again Later !!!!</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                {/* <StatusBar backgroundColor="blue" barStyle="light-content" /> */}
                {/* <StatusBar translucent={false} />
            <Header
              androidStatusBarColor={"#CA6C39"}
              style={{ borderBottomWidth: 0, backgroundColor: '#CA6C39' }}>
              <Body style={styles.headerBody}>
                <Title style={styles.textBody}>My Bookings</Title>
              </Body>
            </Header> */}

                {/* Go ahead and delete ExpoLinksView and replace it with your
               * content, we just wanted to provide you with some helpful links */}
                <FlatList
                    style={styles.listContainer}
                    data={resp.BookingList}
                    renderItem={this.renderItem}
                    keyExtractor={extractKey}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh.bind(this)}
                />
                <View>
                    {/* <Button title="Show me more of the app" onPress={this._showMoreApp} /> */}
                </View>
            </View>
        );

    }

     App = () => {
        const [selectedId, setSelectedId] = useState(null);
      
        const renderItem = ({ item }) => {
          const backgroundColor = item.id === selectedId ? "#d8d7d9" : "#d8d7d9";
      
          return (
            <Item
              item={item}
              onPress={() => setSelectedId(item.id)}
              style={{ backgroundColor }} 
            />
          );
        };
      
        return (
          <SafeAreaView style={styles.container}>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              extraData={selectedId}
            />
          </SafeAreaView>
        );
      };


    _onBookingListItemClick = (item) => {
        // this.setState({ isPasswordInputVisible: true })
        this.props.navigation.navigate('BookingDetailsScreen', { 'item': item });
    }

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
    isFetching3: state.bookings.isFetching3
});

const mapDispatchToProps = dispatch => ({
    fetchBookingList: (data) => dispatch(fetchBookingList(data)),
    getPaymentAmtForTrip : (data) => dispatch(getPaymentAmtForTrip(data)),
    SendPaymentID : (data) => dispatch(SendPaymentID(data))
    
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BookingScreen3);

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        marginTop: 3,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#CA6C39',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'

    },
    centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
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
    },
    
        container: {
          flex: 1,
          marginTop: StatusBar.currentHeight || 0,
        },
        item: {
          padding: 0,
          marginVertical: 8,
          marginHorizontal: 16,
        },
        title: {
          fontSize: 16,
           fontWeight: "bold",
        },
         subTitle: {
          fontSize: 16,
        },
        subItem: {
          padding: 0,
          marginVertical: 2,
          marginHorizontal: 16,
        },
        
      
});

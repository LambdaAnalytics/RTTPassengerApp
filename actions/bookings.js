import { encode } from "base-64";
import * as ACTION_TYPES from "../constants/action-types";
import { AsyncStorage } from 'react-native';

export const fetchBookingList = (data) => async (dispatch, getState) => {

    if (data.bookingType == "1") {
        dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_1 })
    } else if (data.bookingType == "2") {
        dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_2 })
    } else if (data.bookingType == "3") {
        dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_3 })
    } else if (data.bookingType == "4") {
        dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_4 })
    } else if (data.bookingType == "5") {
        dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_5 })
    } else if (data.bookingType == "6") {
        dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_6 })
    }
    //"9902466488" "ak123"
    try {

        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

        const response = await fetch(url + 'api/CustomerApp/BookingList?PassengerMobile=' + data.userMobile + '&BookingListType=' + data.bookingType, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            })
        });
        let bookingListResp = await response.json();
        // console.log("bookingListResp === >>> " + JSON.stringify(bookingListResp));
        // console.log("data.bookingType === >>> " + data.bookingType);
        if (bookingListResp.Status == 200 || bookingListResp.Status == 404) {
            if (data.bookingType == "1") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_1, payload: bookingListResp })
            } else if (data.bookingType == "2") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_2, payload: bookingListResp })
            } else if (data.bookingType == "3") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_3, payload: bookingListResp })
            } else if (data.bookingType == "4") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_4, payload: bookingListResp })
            } else if (data.bookingType == "5") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_5, payload: bookingListResp })
            } else if (data.bookingType == "6") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_6, payload: bookingListResp })
            }
        } else {
            if (data.bookingType == "1") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_1, payload: bookingListResp, error: true })
            } else if (data.bookingType == "2") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_2, payload: bookingListResp, error: true })
            } else if (data.bookingType == "3") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_3, payload: bookingListResp, error: true })
            } else if (data.bookingType == "4") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_4, payload: bookingListResp, error: true })
            } else if (data.bookingType == "5") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_5, payload: bookingListResp, error: true })
            } else if (data.bookingType == "6") {
                dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_6, payload: bookingListResp, error: true })
            }
        }
    } catch (e) {
        dispatch({ type: ACTION_TYPES.FETCH_BOOKING_DATA_FAILED, payload: e, error: true })
    }
}

export const getPaymentAmtForTrip = (reqBody) => async (dispatch, getState) => {

    try {
        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

       
        const response = await fetch(url + 'api/CustomerApp/GetPaymentOrderID', {
            method: 'post',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            }),
            body: JSON.stringify(reqBody)
        });  
        //let resp = await response.json();
        //alert(JSON.stringify(response));
        return response.json();

        // if (resp.Status == 200) {
        //     dispatch({ type: ACTION_TYPES.NEW_BOOKING_SUCESS, payload: resp })
        // } else {
        //     dispatch({ type: ACTION_TYPES.NEW_BOOKING_FAILED, payload: resp, error: true })
        // }
    } catch (e) {
        // dispatch({ type: ACTION_TYPES.NEW_BOOKING_FAILED, payload: e, error: true })
    }
     
}


export const SendPaymentID = (reqBody) => async (dispatch, getState) => {

    try {
        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

       
        const response = await fetch(url + 'api/CustomerApp/SendPaymentID', {
            method: 'post',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            }),
            body: JSON.stringify(reqBody)
        });  
        //let resp = await response.json();
        //alert(JSON.stringify(response));
        return response.json();

        // if (resp.Status == 200) {
        //     dispatch({ type: ACTION_TYPES.NEW_BOOKING_SUCESS, payload: resp })
        // } else {
        //     dispatch({ type: ACTION_TYPES.NEW_BOOKING_FAILED, payload: resp, error: true })
        // }
    } catch (e) {
        // dispatch({ type: ACTION_TYPES.NEW_BOOKING_FAILED, payload: e, error: true })
    }
     
}




export const newBooking = (reqBody) => async (dispatch, getState) => {

    // dispatch({ type: ACTION_TYPES.START_NEW_BOOKING })
    //"9902466488" "ak123"

    try {
        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }


        const response = await fetch(url + 'api/CustomerApp/NewBooking', {
            method: 'post',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            }),
            body: JSON.stringify(reqBody)
        });
        return response.json();

        // if (resp.Status == 200) {
        //     dispatch({ type: ACTION_TYPES.NEW_BOOKING_SUCESS, payload: resp })
        // } else {
        //     dispatch({ type: ACTION_TYPES.NEW_BOOKING_FAILED, payload: resp, error: true })
        // }
    } catch (e) {
        // dispatch({ type: ACTION_TYPES.NEW_BOOKING_FAILED, payload: e, error: true })
    }

}

export const getImeiNumberBasedOnVehicleNo = (reqBody) => async (dispatch, getState) => {

    // dispatch({ type: ACTION_TYPES.START_NEW_BOOKING })
    //"9902466488" "ak123"

    try {
        const response = await fetch('http://apiservices.hawkeyeway.com/livepin/public/user/getImeiNumberBasedOnVehicleNo', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2ExZDJiZDUyOTNiMjA2MTUwNzQ4ZDEiLCJtb2JpbGVOdW1iZXIiOiI5NzAxNjczOTMyIiwibmFtZSI6IlR1cnZvIiwiaWF0IjoxNTU2MTg1MzMzfQ.puqaURM1TkZfbP3aSfJd3ACJZwugWuKVn41e4u_lGBo'
            }),
            body: JSON.stringify(reqBody)
        });
        return response.json();

        // if (resp.Status == 200) {
        //     dispatch({ type: ACTION_TYPES.NEW_BOOKING_SUCESS, payload: resp })
        // } else {
        //     dispatch({ type: ACTION_TYPES.NEW_BOOKING_FAILED, payload: resp, error: true })
        // }
    } catch (e) {
        // dispatch({ type: ACTION_TYPES.FETCH_GPS_DEVICE_FAILED, payload: e, error: true })
    }

}

export const updateDisclaimer = (reqBody) => async (dispatch, getState) => {

    try {
        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }


        const response = await fetch(url + 'api/CustomerApp/UpdateDisclaimer', {
            method: 'post',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            }),
            body: JSON.stringify(reqBody)
        });
        return response.json();

    } catch (e) {
    }

}

export const rejectAppBooking = (reqBody) => async (dispatch, getState) => {

    try {
        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

        const response = await fetch(url + 'api/CustomerApp/RejectAppBooking', {
            method: 'post',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            }),
            body: JSON.stringify(reqBody)
        });
        return response.json();
    } catch (e) {
        // dispatch({ type: ACTION_TYPES.NEW_BOOKING_FAILED, payload: e, error: true })
    }
}

export const getTripStatus = (tripId) => async (dispatch, getState) => {
    
    try {

        let url = await AsyncStorage.getItem('ENV');

        const response = await fetch(url + 'api/CustomerApp/TripStatus?bookingId=' + tripId , {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            })
        });

        return response.json();
       
    } catch (e) {
      console.log(e); 
    }
}

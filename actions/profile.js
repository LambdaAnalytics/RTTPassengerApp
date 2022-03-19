import { encode } from "base-64";
import * as ACTION_TYPES from "../constants/action-types";
import { AsyncStorage } from 'react-native';

export const fetchProfileData = (mobileNo) => async (dispatch, getState) => {

    dispatch({ type: ACTION_TYPES.FETCH_PROFILE_DATA })
    //"9902466488" "ak123"
    try {

        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

        const response = await fetch(url + 'api/CustomerApp/Profile?PassengerMobile=' + mobileNo, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            })
        });
        const profileDataResp = await response.json();
        // console.log("profileDataResp ==" + JSON.stringify(profileDataResp));

        if (profileDataResp.Status == 200) {
            dispatch({ type: ACTION_TYPES.FETCH_PROFILE_DATA_SUCESS, payload: profileDataResp })
        } else {
            dispatch({ type: ACTION_TYPES.FETCH_PROFILE_DATA_FAILED, payload: profileDataResp, error: true })
        }
    } catch (e) {
        dispatch({ type: ACTION_TYPES.FETCH_PROFILE_DATA_FAILED, payload: e, error: true })
    }
}

export const fetchProfileDataForPromise = (mobileNo) => async (dispatch, getState) => {

    // dispatch({ type: ACTION_TYPES.FETCH_PROFILE_DATA })
    //"9902466488" "ak123"
    try {

        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

        const response = await fetch(url + 'api/CustomerApp/Profile?PassengerMobile=' + mobileNo, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            })
        });
        return response.json();
        // console.log("profileDataResp ==" + JSON.stringify(profileDataResp));

        // if (profileDataResp.St   atus == 200) {
        //     dispatch({ type: ACTION_TYPES.FETCH_PROFILE_DATA_SUCESS, payload: profileDataResp })
        // } else {
        //     dispatch({ type: ACTION_TYPES.FETCH_PROFILE_DATA_FAILED, payload: profileDataResp, error: true })
        // }
    } catch (e) {
        // dispatch({ type: ACTION_TYPES.FETCH_PROFILE_DATA_FAILED, payload: e, error: true })
    }
}

export const getApproverDetails = (reqBody) => async (dispatch, getState) => {

    try {

        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

        const response = await fetch(url + 'api/CustomerApp/getApproverDetails', {
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

export const getDisclaimer = (passengerId) => async (dispatch, getState) => {

    try {

        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

        const response = await fetch(url + 'api/CustomerApp/GetDisclaimer?passengerId=' + passengerId, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            })
        });
        return response.json();
    } catch (e) {
    }
}
import { encode } from "base-64";
import * as ACTION_TYPES from "../constants/action-types";
import { AsyncStorage } from 'react-native';


export const loginRequest = (userName, password) => async (dispatch, getState) => {

  dispatch({ type: ACTION_TYPES.USER_LOGIN_REQUESTED })
  //"9902466488" "ak123"
  // console.log("resp ---123123-- >>");
  try {
    let url = await AsyncStorage.getItem('ENV');
    // console.log("resp ---123123-- >>", url);
    // if (url == null) {
    //   url = 'http://rtt.zegago.com/';
    // }

    const response = await fetch(url + 'api/CustomerApp/Login', {
      method: 'post',
      headers: new Headers({
        'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
        'Content-Type': 'application/json',
        'xApiKey': 'a8601080048a'
      }),
      body: JSON.stringify({
        "PassengerMobile": userName,
        "Password": password
      })
    });
    const resp = await response.json();
    // console.log("resp ----- >>" + JSON.stringify(resp));

    if (resp.Status == 200) {
      dispatch({ type: ACTION_TYPES.USER_LOGIN_SUCCESS, payload: resp })
    } else {
      dispatch({ type: ACTION_TYPES.USER_LOGIN_FAILED, payload: resp, error: true })
    }
  } catch (e) {
    dispatch({ type: ACTION_TYPES.USER_LOGIN_FAILED, payload: e, error: true })
  }
}


export const userLoginSuccess = ({ email, password }) => ({
  types: [
    ACTION_TYPES.USER_LOGIN_REQUESTED,
    ACTION_TYPES.USER_LOGIN_SUCCESS,
    ACTION_TYPES.USER_LOGIN_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/login-success",
      data: {
        email,
        password
      }
    }
  }
});

export const userLoginFail = ({ email, password }) => ({
  types: [
    ACTION_TYPES.USER_LOGIN_REQUESTED,
    ACTION_TYPES.USER_LOGIN_SUCCESS,
    ACTION_TYPES.USER_LOGIN_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/login-fail",
      data: {
        email,
        password
      }
    }
  }
});

export function userRequestLogout() {
  return {
    type: ACTION_TYPES.USER_LOGOUT_REQUESTED,
    payload: {},
  };
}

export const forgotPassword = (reqBody) => async (dispatch, getState) => {

  try {
    let url = await AsyncStorage.getItem('ENV');
    // if (url == null) {
    //   url = 'http://rtt.zegago.com/';
    // }

    const response = await fetch(url + 'api/CustomerApp/SendPassengerOTP', {
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

export const verifyPassengerOTP = (reqBody) => async (dispatch, getState) => {

  try {
    let url = await AsyncStorage.getItem('ENV');

    // if (url == null) {
    //   url = 'http://rtt.zegago.com/';
    // }

    const response = await fetch(url + 'api/CustomerApp/VerifyPassengerOTP', {
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

export const createPassengerPin = (reqBody) => async (dispatch, getState) => {

  try {
    let url = await AsyncStorage.getItem('ENV');

    // if (url == null) {
    //   url = 'http://rtt.zegago.com/';
    // }

    const response = await fetch(url + 'api/CustomerApp/CreatePassengerPin', {
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

export const SendNewPassengerOTP = (reqBody) => async (dispatch, getState) => {

  try {
    let url = await AsyncStorage.getItem('ENV');

    // if (url == null) {
    //   url = 'http://rtt.zegago.com/';
    // }

    const response = await fetch(url + 'api/CustomerApp/SendNewPassengerOTP', {
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

export const Signup = (reqBody) => async (dispatch, getState) => {

  try {
    let url = await AsyncStorage.getItem('ENV');

    // if (url == null) {
    //   url = 'http://rtt.zegago.com/';
    // }

    const response = await fetch(url + 'api/CustomerApp/Signup', {
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

export const updateApproverDetails = (reqBody) => async (dispatch, getState) => {

  try {
    let url = await AsyncStorage.getItem('ENV');

    // if (url == null) {
    //   url = 'http://rtt.zegago.com/';
    // }

    const response = await fetch(url + 'api/CustomerApp/UpdateApproverDetails', {
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

export const updateFCMKey = (reqBody) => async (dispatch, getState) => {

  try {
    let url = await AsyncStorage.getItem('ENV');

    // if (url == null) {
    //   url = 'http://rtt.zegago.com/';
    // }

    const response = await fetch(url + 'api/CustomerApp/UpdateFCMKey', {
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
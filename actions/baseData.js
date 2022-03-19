import { encode } from "base-64";
import * as ACTION_TYPES from "../constants/action-types";
import { AsyncStorage } from 'react-native';

export const fetchVehicleType = () => async (dispatch, getState) => {

    dispatch({ type: ACTION_TYPES.FETCH_DATA })
    //"9902466488" "ak123"
    try {

        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

        const response = await fetch(url + 'api/CustomerApp/VehicleTypes', {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            })
        });
        const vehicleTypeResp = await response.json();

        const response2 = await fetch(url + 'api/CustomerApp/PlaceTypes', {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            })
        });
        const placeTypeResp = await response2.json();
        const resp = {
            vehicleTypeResp, placeTypeResp
        }

        // console.log("resp == >>>>" + JSON.stringify(resp));


        if (resp.vehicleTypeResp.Status == 200 && resp.vehicleTypeResp.Status == 200) {
            dispatch({ type: ACTION_TYPES.FETCH_DATA_SUCESS, payload: resp })
        } else {
            dispatch({ type: ACTION_TYPES.FETCH_DATA_FAILED, payload: resp, error: true })
        }
    } catch (e) {
        dispatch({ type: ACTION_TYPES.FETCH_DATA_FAILED, payload: e, error: true })
    }
}


export const fetchVehicleTypeOnly = (customerId,passengerId,corpSelectedCityId) => async (dispatch, getState) => {
    
      try {
  
          let url = await AsyncStorage.getItem('ENV');
  
          const response = await fetch(url + 'api/CustomerApp/VehicleTypes?passengerId=' + passengerId + '&custId='+ customerId + '&cityId='+corpSelectedCityId , {
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

  export const getTarrifDetails = (custId,ServiceCityId,VehicleTypeId) => async (dispatch, getState) => {
    
    try {

        let url = await AsyncStorage.getItem('ENV');

     const response = await fetch(url + 'api/CustomerApp/ViewTariff?custId=' + custId + '&ServiceCityId='+ ServiceCityId + '&VehicleTypeId='+VehicleTypeId , {
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
  

export const fetchCorporateBookingBaseData = (passengerId) => async (dispatch, getState) => {

    // dispatch({ type: ACTION_TYPES.FETCH_CORPORATE_BOOKING_DATA_1 });
    try {

        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

        const response = await fetch(url + 'api/CustomerApp/PreBooking?passengerId=' + passengerId, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Basic ' + encode('5d9ca803d3fc:de38d2e0'),
                'Content-Type': 'application/json',
                'xApiKey': 'a8601080048a'
            })
        });
        return response.json();
        // console.log("corporateBookingBaseData === >>> " + JSON.stringify(corporateBookingBaseData));

        // if (corporateBookingBaseData.Status == 200 || corporateBookingBaseData.Status == 404) {
        //     dispatch({ type: ACTION_TYPES.FETCH_CORPORATE_BOOKING_DATA_SUCESS_1, payload: corporateBookingBaseData })
        // } else {
        //     dispatch({ type: ACTION_TYPES.FETCH_CORPORATE_BOOKING_DATA_FAILED_1, payload: corporateBookingBaseData, error: true })
        // }
    } catch (e) {
        // dispatch({ type: ACTION_TYPES.FETCH_CORPORATE_BOOKING_DATA_FAILED_1, payload: e, error: true })
    }
}

export const fetchCorporateBookingBaseData2 = (reqBody) => async (dispatch, getState) => {

    // dispatch({ type: ACTION_TYPES.START_NEW_BOOKING })
    //"9902466488" "ak123"

    try {
        let url = await AsyncStorage.getItem('ENV');

        // if (url == null) {
        //     url = 'http://rtt.zegago.com/';
        // }

        const response = await fetch(url + 'api/CustomerApp/PreBooking2', {
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


export const googleMapAutoComplete1 = (location) => (dispatch, getState) => {

    dispatch({ type: ACTION_TYPES.GOOGLE_MAP_AUTOCOMPLETE_LOC1, payload: { "location": location } })

}

export const googleMapAutoComplete2 = (location) => (dispatch, getState) => {

    dispatch({ type: ACTION_TYPES.GOOGLE_MAP_AUTOCOMPLETE_LOC2, payload: { "location": location } })

}

export const corpGoogleMapAutoComplete = (location) => (dispatch, getState) => {

    dispatch({ type: ACTION_TYPES.CORP_GOOGLE_MAP_AUTOCOMPLETE_LOC, payload: { "location": location } })

}

export const resetAutoCompleteFields = () => (dispatch, getState) => {

    dispatch({ type: ACTION_TYPES.RESET_GOOGLE_MAP_AUTOCOMPLETE_LOC1AND2, payload: { "location": undefined } })

}

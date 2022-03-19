import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
    isFetching: true,
    vehicleTypesList: undefined,
    placeTypesList: undefined,
    isFailed: false,
    location1: {
        address: ''
    },
    location2: {
        address: ''
    },
    location3: {
        address: ''
    },
    corporateBookingBaseData: undefined,
    isFetchingCorp: true,
    isFailedCorp: false
};

export default (state = initialState, action) => {
    const { type, payload, error } = action;

    switch (type) {
        case ACTION_TYPES.FETCH_DATA_SUCESS:
            // console.log(" ==== " + JSON.stringify(payload));

            return {
                ...state,
                isFetching: false,
                placeTypesList: payload.placeTypeResp.PlaceTypes,
                vehicleTypesList: payload.vehicleTypeResp.VehicleTypes,
                isFailed: false
            };

        case ACTION_TYPES.FETCH_DATA:
            return {
                ...state,
                isFetching: true,
                isFailed: false
            };

        case ACTION_TYPES.FETCH_DATA_FAILED:
            return {
                ...state,
                isFetching: false,
                isFailed: true
            };

        case ACTION_TYPES.FETCH_CORPORATE_BOOKING_DATA_SUCESS_1:
            // console.log(" ==== " + JSON.stringify(payload));

            return {
                ...state,
                isFetchingCorp: false,
                corporateBookingBaseData: payload,
                isFailed: false
            };

        case ACTION_TYPES.FETCH_CORPORATE_BOOKING_DATA_1:
            return {
                ...state,
                isFetchingCorp: true,
                isFailedCorp: false
            };

        case ACTION_TYPES.FETCH_CORPORATE_BOOKING_DATA_FAILED_1:
            return {
                ...state,
                isFetchingCorp: false,
                isFailedCorp: true
            };

        case ACTION_TYPES.USER_LOGOUT_REQUESTED:
            return {
                ...initialState
            };

        case ACTION_TYPES.GOOGLE_MAP_AUTOCOMPLETE_LOC1:
            // console.log(" ==== loc1" + JSON.stringify(payload));
            return {
                ...state,
                location1: payload.location
            };
        case ACTION_TYPES.GOOGLE_MAP_AUTOCOMPLETE_LOC2:
            // console.log(" ==== loc2" + JSON.stringify(payload));
            return {
                ...state,
                location2: payload.location
            };
        case ACTION_TYPES.CORP_GOOGLE_MAP_AUTOCOMPLETE_LOC:
            // console.log(" ==== loc3" + JSON.stringify(payload));
            return {
                ...state,
                location3: payload.location
            };
        case ACTION_TYPES.RESET_GOOGLE_MAP_AUTOCOMPLETE_LOC1AND2:
            // console.log(" ==== " + JSON.stringify(payload));
            return {
                ...state,
                location1: {
                    address: 'Enter Origin'
                },
                location2: {
                    address: 'Enter Destination'
                },
                location3: {
                    address: 'Enter Reporting Address'
                }
            };
        default:
            return state;
    }
};

import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
    isFetching1: true,
    isFailed1: false,
    isFetching2: true,
    isFailed2: false,
    isFetching3: true,
    isFailed3: false,
    isFetching4: true,
    isFailed4: false,
    isFetching5: true,
    isFailed5: false,
    isFetching6: true,
    isFailed6: false,
    bookingListResp1: undefined,
    bookingListResp2: undefined,
    bookingListResp3: undefined,
    bookingListResp4: undefined,
    bookingListResp5: undefined,
    bookingListResp6: undefined,
    newBookingResp: undefined,
    isNewBookingRequested: false,
    isNewBookingSuccess: false,
};

export default (state = initialState, action) => {
    const { type, payload, error } = action;

    switch (type) {
        case ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_1:
            // console.log(" ==== " + JSON.stringify(payload));

            return {
                ...state,
                isFetching1: false,
                bookingListResp1: payload,
                isFailed1: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_1:
            return {
                ...state,
                isFetching1: true,
                isFailed1: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_1:
            return {
                ...state,
                isFetching1: false,
                isFailed1: true
            };


        case ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_2:
            // console.log(" ==== " + JSON.stringify(payload));

            return {
                ...state,
                isFetching2: false,
                bookingListResp2: payload,
                isFailed2: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_2:
            return {
                ...state,
                isFetching2: true,
                isFailed2: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_2:
            return {
                ...state,
                isFetching2: false,
                isFailed2: true
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_3:
            // console.log(" ==== " + JSON.stringify(payload));

            return {
                ...state,
                isFetching3: false,
                bookingListResp3: payload,
                isFailed3: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_3:
            return {
                ...state,
                isFetching3: true,
                isFailed3: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_3:
            return {
                ...state,
                isFetching3: false,
                isFailed3: true
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_4:
            // console.log(" ==== " + JSON.stringify(payload));

            return {
                ...state,
                isFetching4: false,
                bookingListResp4: payload,
                isFailed4: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_4:
            return {
                ...state,
                isFetching4: true,
                isFailed4: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_4:
            return {
                ...state,
                isFetching4: false,
                isFailed4: true
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_5:
            // console.log(" ==== " + JSON.stringify(payload));

            return {
                ...state,
                isFetching5: false,
                bookingListResp5: payload,
                isFailed5: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_5:
            return {
                ...state,
                isFetching5: true,
                isFailed5: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_5:
            return {
                ...state,
                isFetching5: false,
                isFailed5: true
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_SUCESS_6:
            // console.log(" ==== " + JSON.stringify(payload));

            return {
                ...state,
                isFetching6: false,
                bookingListResp6: payload,
                isFailed6: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_6:
            return {
                ...state,
                isFetching6: true,
                isFailed6: false
            };

        case ACTION_TYPES.FETCH_BOOKING_DATA_FAILED_6:
            return {
                ...state,
                isFetching6: false,
                isFailed6: true
            };
        case ACTION_TYPES.NEW_BOOKING_SUCESS:
            console.log(" ==== " + JSON.stringify(payload));
            return {
                ...state,
                isNewBookingRequested: false,
                newBookingResp: payload,
                isFailed: false,
                isNewBookingSuccess: true
            };

        case ACTION_TYPES.START_NEW_BOOKING:
            return {
                ...state,
                isNewBookingRequested: true,
                isFailed: false
            };

        case ACTION_TYPES.NEW_BOOKING_FAILED:
            return {
                ...state,
                isNewBookingRequested: false,
                isFailed: true
            };
          /*  case ACTION_TYPES.GET_PAYMENT_AMT_FOR_TRIP:
                alert(payload);
                return{

                    ...state,
                isPaymentAmtForRespRequested: false,
                paymentAmtForResp: payload,
                isFailed: false,
                isPaymentAmtForRespSuccess: true

                }
                */

        default:
            return state;
    }
};

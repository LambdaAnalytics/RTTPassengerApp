import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
    isFetching: true,
    profileDataResp: undefined,
    isFailed: false
};

export default (state = initialState, action) => {
    const { type, payload, error } = action;

    switch (type) {
        case ACTION_TYPES.FETCH_PROFILE_DATA_SUCESS:
            // console.log(" ==== " + JSON.stringify(payload));

            return {
                ...state,
                isFetching: false,
                profileDataResp: payload,
                isFailed: false
            };

        case ACTION_TYPES.FETCH_PROFILE_DATA:
            return {
                ...state,
                isFetching: true,
                isFailed: false
            };

        case ACTION_TYPES.FETCH_PROFILE_DATA_FAILED:
            return {
                ...state,
                isFetching: false,
                isFailed: true
            };

        default:
            return state;
    }
};

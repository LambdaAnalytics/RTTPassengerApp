import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
    uri: undefined
};

export default (state = initialState, action) => {
    const { type, payload, error } = action;

    switch (type) {
        case "IMAGE_CAPTURE":
            console.log("hereeeeeee F-16");

            return {
                ...state
            };
        default:
            return state;
    }
};

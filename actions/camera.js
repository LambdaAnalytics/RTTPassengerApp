import * as ACTION_TYPES from "../constants/action-types";

export const imageCaptureSuccess = ({ uri }) => ({

    types: [
        "IMAGE_CAPTURE"
    ],
    payload: {
        uri
    }
});

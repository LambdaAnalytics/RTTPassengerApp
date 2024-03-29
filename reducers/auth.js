import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
  token: undefined,
  isAuthenticating: false,
  error: undefined,
  isFailed: false
};

export default (state = initialState, action) => {
  const { type, payload, error } = action;

  switch (type) {
    case ACTION_TYPES.USER_LOGIN_REQUESTED:
      return {
        ...state,
        isAuthenticating: true,
        isFailed: false
      };
    case ACTION_TYPES.USER_LOGIN_SUCCESS:
      // console.log(payload);
      return {
        token: payload.PassengerProfile,
        isAuthenticating: false,
        isFailed: false
      };
    case ACTION_TYPES.USER_LOGIN_FAILED:
      // console.log(payload.Message);
      return {
        error: payload.Message,
        isAuthenticating: false,
        isFailed: true
      };
    case ACTION_TYPES.USER_LOGOUT_REQUESTED:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

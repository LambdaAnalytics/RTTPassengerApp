import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { reducer as modalReducer } from "redux-modal";
import authReducers from "./auth";
import cameraReducers from "./camera";
import baseDataReducers from "./baseData";
import bookingsReducers from "./bookings";
import profileReducers from "./profile";

export default combineReducers({
  form: formReducer,
  modal: modalReducer,
  auth: authReducers,
  camera: cameraReducers,
  baseData: baseDataReducers,
  bookings: bookingsReducers,
  profile: profileReducers
});

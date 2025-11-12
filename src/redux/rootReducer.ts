import { combineReducers } from "redux";
import comercialReducer from "./Modulos/Comercial/reducer";
import errorReducer from "./errorAndResponse";

const rootReducer = combineReducers({
  comercial: comercialReducer,
  errorAndResponse: errorReducer,
});

export default rootReducer;

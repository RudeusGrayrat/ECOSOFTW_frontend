import { combineReducers } from "redux";
import comercialReducer from "./Modulos/Comercial/reducer";
import errorReducer from "./errorAndResponse";
import herramientasReducer from "./Modulos/Herramientas/reducer";

const rootReducer = combineReducers({
  comercial: comercialReducer,
  herramientas: herramientasReducer,
  errorAndResponse: errorReducer,
});

export default rootReducer;

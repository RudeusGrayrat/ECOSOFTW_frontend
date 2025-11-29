import { GET_SUBMODULES, GET_WIDGETS_PREFERENCE } from "./type";

const iniTialState = {
  widgetsPreference: [],
  submodules: [],
};

const herramientasReducer = (state = iniTialState, action) => {
  switch (action.type) {
    case GET_WIDGETS_PREFERENCE:
      return {
        ...state,
        widgetsPreference: action.payload,
      };
    case GET_SUBMODULES:
      return {
        ...state,
        submodules: action.payload,
      };
    default:
      return state;
  }
};

export default herramientasReducer;

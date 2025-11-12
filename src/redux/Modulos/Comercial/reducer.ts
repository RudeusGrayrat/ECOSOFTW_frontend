import { GET_CLIENTES_COMERCIAL } from "./type";

const initialState = {
  clientes: [],
};

const comercialReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_CLIENTES_COMERCIAL:
      return {
        ...state,
        clientes: action.payload,
      };
    default:
      return state;
  }
};
export default comercialReducer;

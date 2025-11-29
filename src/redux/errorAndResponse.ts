const initialState = {
  type: "", // Ej: "success", "error", "warning"
  message: "", // El mensaje que se mostrará
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MESSAGE":
      return {
        type: action.payload.type,
        message: action.payload.message,
      };

    case "CLEAR_MESSAGE":
      return {
        type: "",
        message: "",
      };

    default:
      return state;
  }
};

export default errorReducer;

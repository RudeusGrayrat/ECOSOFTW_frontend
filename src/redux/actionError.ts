const SET_MESSAGE = "SET_MESSAGE";

export const setMessage = (message, type) => async (dispatch) => {
  let realMessage = message?.response?.data?.message
    ? message.response.data.message
    : message;
  if (typeof realMessage === "object") {
    realMessage = realMessage.toString();
  }
  try {
    dispatch({ type: SET_MESSAGE, payload: { message: realMessage, type } });
  } catch (error) {
    throw error;
  }
};

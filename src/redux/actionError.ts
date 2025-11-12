const SET_MESSAGE = "SET_MESSAGE";

export const setMessage = (message, type) => async (dispatch) => {
  try {
    dispatch({ type: SET_MESSAGE, payload: { message, type } });
  } catch (error) {
    throw error;
  }
};

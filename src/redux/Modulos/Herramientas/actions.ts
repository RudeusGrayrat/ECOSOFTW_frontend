import axios from "../../../api/axios";
import { GET_WIDGETS_PREFERENCE, GET_SUBMODULES } from "./type";

export const getWidgetsPreference = (colaborador) => async (dispatch) => {
  try {
    const response = await axios.get(`/getWidgetsPreference/${colaborador}`);
    const data = response.data;
    dispatch({
      type: GET_WIDGETS_PREFERENCE,
      payload: data,
    });
  } catch (error) {
    throw error;
  }
};

export const getSubModule = () => async (dispatch) => {
  try {
    const response = await axios.get("/getSubModules");
    const data = response.data;
    dispatch({
      type: GET_SUBMODULES,
      payload: data,
    });
  } catch (error) {
    throw error;
  }
};

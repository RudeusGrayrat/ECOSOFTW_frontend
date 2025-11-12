import axios from "./axios";

export const verifyToken = async (localToken) => {
  try {
    return await axios.get("/auth/verify", {
      headers: { Authorization: `Bearer ${localToken}` },
    });
  } catch (error) {
    throw error; // << IMPORTANTE
  }
};

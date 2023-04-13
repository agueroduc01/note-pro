import axios from "axios";
import jwt_decode from "jwt-decode";
import { getAccessTokenService } from "../services/user";
import { getCookie } from "./common-utils";

export const createAxios = (accessToken, dispatch, stateSuccess) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      const decodedToken = jwt_decode(accessToken);
      let date = new Date();
      if (decodedToken.exp < date.getTime() / 1000) {
        const refreshToken = getCookie("refreshToken");
        const data = await getAccessTokenService(refreshToken);
        dispatch(stateSuccess(data.data.data));
        config.headers["authorization"] = "Bearer " + data.data.data;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return newInstance;
};

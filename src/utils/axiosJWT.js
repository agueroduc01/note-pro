import axios from "axios";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import { DataContext } from "../context/DataProvider";
import { getAccessTokenService } from "../services/user";

export const createAxios = () => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      const { setAccessToken, accessToken } = useContext(DataContext);
      const decodedToken = jwt_decode(accessToken);
      let date = new Date();
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await getAccessTokenService();
        setAccessToken(data.data.data);
        config.headers["token"] = "Bearer " + data.data.data;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return newInstance;
};

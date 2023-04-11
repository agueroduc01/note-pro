import axios from "axios";

const getAccessTokenService = (refreshToken) => {
  return axios.post("http://localhost:3000/api/v1/get-access-token", {
    refreshToken,
    // withCredentials: true,
  });
};

export default getAccessTokenService;

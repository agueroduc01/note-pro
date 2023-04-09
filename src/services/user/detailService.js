import axios from "axios";

const detailService = (accessToken) => {
  return axios.get("http://localhost:3000/api/v1/get-user-details", {
    headers: { authorization: `Bearer ${accessToken}` },
  });
};

export default detailService;

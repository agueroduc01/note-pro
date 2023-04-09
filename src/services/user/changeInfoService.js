import axios from "axios";

const changeInfoService = (fullName, phoneNumber, accessToken) => {
  return axios.put(
    "http://localhost:3000/api/v1/change-infor",
    {
      fullName,
      phoneNumber,
    },
    {
      headers: { authorization: `Bearer ${accessToken}` },
    }
  );
};

export default changeInfoService;

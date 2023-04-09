import axios from "axios";

const registerService = (email, password, fullName, phoneNumber) => {
  return axios.post(
    "http://localhost:3000/api/v1/register",
    { email, password, fullName, phoneNumber }
    // {
    //   withCredentials: true,
    //   proxy: "http://localhost:3000",
    //   origin: "http://localhost:3000",
    // }
  );
};

export default registerService;

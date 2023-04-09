import axios from "axios";

const forgotPasswordService = (email) => {
  return axios.post(
    "http://localhost:3000/api/v1/forget-password",
    { email }
    // {
    //   withCredentials: true,
    //   proxy: "http://localhost:3000",
    //   origin: "http://localhost:3000",
    // }
  );
};

export default forgotPasswordService;

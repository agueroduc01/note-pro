import axios from "axios";

const resetPasswordService = (codeVerify, newPassword) => {
  return axios.post(
    "http://localhost:3000/api/v1/reset-password",
    { codeVerify, newPassword }
    // {
    //   withCredentials: true,
    //   proxy: "http://localhost:3000",
    //   origin: "http://localhost:3000",
    // }
  );
};

export default resetPasswordService;

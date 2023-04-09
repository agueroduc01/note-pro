import axios from "axios";

const changePasswordService = (newPassword, oldPassword, accessToken) => {
  return axios.put(
    "http://localhost:3000/api/v1/change-password",
    {
      newPassword,
      oldPassword,
    },
    {
      headers: { authorization: `Bearer ${accessToken}` },
    }
  );
};

export default changePasswordService;

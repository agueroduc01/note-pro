const changePasswordService = (
  newPassword,
  oldPassword,
  accessToken,
  axiosJWT
) => {
  return axiosJWT.put(
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

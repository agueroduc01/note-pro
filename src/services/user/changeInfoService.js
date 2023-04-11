const changeInfoService = (fullName, phoneNumber, accessToken, axiosJWT) => {
  return axiosJWT.put(
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

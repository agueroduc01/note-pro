const getMembers = (accessToken, noteId, pageIndex, limit, axiosJWT) => {
  return axiosJWT.get(
    `http://localhost:3000/api/v1/members/get-members?noteId=${noteId}&pageIndex=${pageIndex}&limit=${limit}`,
    {
      headers: { authorization: `Bearer ${accessToken}` },
    }
  );
};

export default getMembers;

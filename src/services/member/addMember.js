const addMember = (noteId, accessToken, member, axiosJWT) => {
  return axiosJWT.post(
    `http://localhost:3000/api/v1/members/add-member?noteId=${noteId}`,
    {
      email: member.email,
      role: member.role,
    },
    {
      headers: { authorization: `Bearer ${accessToken}` },
    }
  );
};

export default addMember;

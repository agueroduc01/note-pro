const editMember = (noteId, accessToken, member, axiosJWT) => {
  return axiosJWT.put(
    `http://localhost:3000/api/v1/members/edit-member?noteId=${noteId}&memberId=${member.id}`,
    {
      role: member.role,
    },
    {
      headers: { authorization: `Bearer ${accessToken}` },
    }
  );
};

export default editMember;

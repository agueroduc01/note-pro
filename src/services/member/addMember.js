import axios from "axios";

const addMember = (noteId, accessToken, member) => {
  return axios.post(
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

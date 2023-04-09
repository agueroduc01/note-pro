import axios from "axios";

const deleteMember = (noteId, accessToken, memberId) => {
  return axios.delete(
    `http://localhost:3000/api/v1/members/delete-member?noteId=${noteId}&memberId=${memberId}`,
    {
      headers: { authorization: `Bearer ${accessToken}` },
    }
  );
};

export default deleteMember;

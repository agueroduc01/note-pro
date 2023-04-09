import axios from "axios";

const getNotes = (accessToken) => {
  return axios.get("http://localhost:3000/api/v1/notes/get-notes", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
};

export default getNotes;

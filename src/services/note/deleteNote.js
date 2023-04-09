import axios from "axios";

const deleteNote = (note, accessToken) => {
  return axios.delete(
    `http://localhost:3000/api/v1/notes/delete-note?id=${note.id}`,
    {
      headers: { authorization: `Bearer ${accessToken}` },
    }
  );
};

export default deleteNote;

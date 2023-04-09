import axios from "axios";

const editNote = (noteId, formData, accessToken) => {
  return axios.put(
    `http://localhost:3000/api/v1/notes/edit-note?id=${noteId}`,
    formData,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export default editNote;

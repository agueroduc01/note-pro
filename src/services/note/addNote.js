import axios from "axios";

const addNote = (formData, accessToken) => {
  return axios.post("http://localhost:3000/api/v1/notes/add-note", formData, {
    headers: { authorization: `Bearer ${accessToken}` },
    "Content-Type": "multipart/form-data",
  });
};

export default addNote;

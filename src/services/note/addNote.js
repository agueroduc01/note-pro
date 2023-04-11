const addNote = (formData, accessToken, axiosJWT) => {
  return axiosJWT.post(
    "http://localhost:3000/api/v1/notes/add-note",
    formData,
    {
      headers: { authorization: `Bearer ${accessToken}` },
      "Content-Type": "multipart/form-data",
    }
  );
};

export default addNote;

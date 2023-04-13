const deleteNote = (note, accessToken, axiosJWT) => {
  return axiosJWT.delete(
    `http://localhost:3000/api/v1/notes/delete-note?id=${note.id}`,
    {
      headers: { authorization: `Bearer ${accessToken}` },
    }
  );
};

export default deleteNote;

import { useContext } from "react";

import { Card, CardContent, CardActions, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  RestoreFromTrashOutlined as Restore,
  DeleteForeverOutlined as Delete,
} from "@mui/icons-material";
import { DataContext } from "../../context/DataProvider";
import { deleteNoteService } from "../../services/note";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const StyledCard = styled(Card)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 240px;
  margin: 8px;
  box-shadow: none;
`;

const DeleteNote = ({ deleteNote }) => {
  const { deleteNotes, setNotes, setDeleteNotes } = useContext(DataContext);
  const accessToken = useSelector((state) => state.user.login.accessToken);

  const restoreNote = (deleteNote) => {
    const updatedNotes = deleteNotes.filter(
      (data) => data.id !== deleteNote.id
    );
    setDeleteNotes(updatedNotes);
    setNotes((prevArr) => [deleteNote, ...prevArr]);
  };

  const removeNote = async (deleteNote) => {
    try {
      let data = await deleteNoteService(deleteNote.id, accessToken);
      if (data) {
        const updatedNotes = deleteNotes.filter(
          (data) => data.id !== deleteNote.id
        );
        setDeleteNotes(updatedNotes);
        toast.success(data.data.message);
      }
    } catch (error) {
      toast.success(error.response.data.message);
    }
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography>{deleteNote.title}</Typography>
        <Typography>{deleteNote.content}</Typography>
      </CardContent>
      <CardActions>
        <Delete
          fontSize="small"
          style={{ marginLeft: "auto" }}
          onClick={() => removeNote(deleteNote)}
        />
        <Restore fontSize="small" onClick={() => restoreNote(deleteNote)} />
      </CardActions>
    </StyledCard>
  );
};

export default DeleteNote;

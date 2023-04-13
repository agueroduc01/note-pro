import { useContext } from "react";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  RestoreFromTrashOutlined as Restore,
  DeleteForeverOutlined as Delete,
} from "@mui/icons-material";
import { DataContext } from "../../context/DataProvider";
import { deleteNoteService, editNoteService } from "../../services/note";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createAxios } from "../../utils/createInstance";
import { loginSuccess } from "../../redux/authSlice";

const StyledCard = styled(Card)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 240px;
  margin: 8px;
  box-shadow: none;
`;

const DeleteNote = ({ deleteNote }) => {
  const { deleteNotes, setNotes, setDeleteNotes, setIsLoading } =
    useContext(DataContext);
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(accessToken, dispatch, loginSuccess);

  const restoreNote = async (deleteNote) => {
    try {
      const formData = new FormData();
      formData.append("title", deleteNote.title);
      formData.append("content", deleteNote.content);
      formData.append("isPin", deleteNote.isPin);
      formData.append("isArchived", deleteNote.isArchived);
      formData.append("isRemoved", !deleteNote.isRemoved);
      formData.append("deleteImageIds", JSON.stringify([]));
      formData.append("images", deleteNote.images);
      setIsLoading(true);
      let data = await editNoteService(
        deleteNote.id,
        formData,
        accessToken,
        axiosJWT
      );
      setIsLoading(false);
      if (data) {
        if (data.data.data.isRemoved === false) {
          toast.success("Restore note successfully!");
          const updatedNotes = deleteNotes.filter(
            (data) => data.id !== deleteNote.id
          );
          setDeleteNotes(updatedNotes);
          setNotes((prevArr) => [data.data.data, ...prevArr]);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.status, error.response.data.message);
    }
  };

  const removeNote = async (deleteNote) => {
    try {
      setIsLoading(true);
      let data = await deleteNoteService(deleteNote, accessToken, axiosJWT);
      setIsLoading(false);
      if (data.data) {
        const updatedNotes = deleteNotes.filter(
          (data) => data.id !== deleteNote.id
        );
        setDeleteNotes(updatedNotes);
        toast.success(data.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <StyledCard>
      {deleteNote.images && deleteNote.images.length > 0 && (
        <CardContent
          // onClick={handleOpenEditNote}
          style={{
            paddingBottom: "0",
            paddingRight: "32px",
          }}
        >
          <Grid container spacing={deleteNote.images.length}>
            {deleteNote.images.map((image, index) => (
              <Grid item key={index} style={{ height: "220px" }}>
                <img
                  src={image.url}
                  alt="images"
                  style={{
                    height: "100%",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      )}
      <CardContent>
        <Typography
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            padding: "2px 10px 0 0",
            cursor: "pointer",
          }}
        >
          {deleteNote.title}
        </Typography>
        <Typography
          gutterBottom
          style={{
            padding: "4px 10px 0 0",
            cursor: "pointer",
          }}
        >
          {deleteNote.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Delete
          fontSize="small"
          style={{ marginLeft: "auto" }}
          onClick={() => removeNote(deleteNote)}
          sx={{
            "&:hover": {
              background: "#848687",
              borderRadius: "50%",
              cursor: "pointer",
            },
          }}
        />
        <Restore
          fontSize="small"
          onClick={() => restoreNote(deleteNote)}
          sx={{
            "&:hover": {
              background: "#848687",
              borderRadius: "50%",
              cursor: "pointer",
            },
          }}
        />
      </CardActions>
    </StyledCard>
  );
};

export default DeleteNote;

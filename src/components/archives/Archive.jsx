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
  UnarchiveOutlined as Unarchive,
  DeleteOutlineOutlined as Delete,
} from "@mui/icons-material";

import { DataContext } from "../../context/DataProvider";
import { editNoteService } from "../../services/note";
import { useSelector } from "react-redux";
import { createAxios } from "../../utils/createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const StyledCard = styled(Card)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  min-width: 240px;
  margin: 8px;
  box-shadow: none;
`;

const Archive = ({ archive }) => {
  const {
    archiveNotes,
    setNotes,
    setAcrchiveNotes,
    setDeleteNotes,
    setIsLoading,
  } = useContext(DataContext);
  const accessToken = useSelector((state) => state.user.login.accessToken);

  const dispatch = useDispatch();
  let axiosJWT = createAxios(accessToken, dispatch, loginSuccess);

  const unArchiveNote = async (archive) => {
    try {
      const formData = new FormData();
      formData.append("title", archive.title);
      formData.append("content", archive.content);
      formData.append("isPin", archive.isPin);
      formData.append("isArchived", !archive.isArchived);
      formData.append("isRemoved", archive.isRemoved);
      formData.append("deleteImageIds", JSON.stringify([]));
      formData.append("images", archive.images);
      setIsLoading(true);
      let data = await editNoteService(
        archive.id,
        formData,
        accessToken,
        axiosJWT
      );
      setIsLoading(false);
      if (data) {
        if (data.data.data.isArchived === false) {
          toast.success("Unarchive successfully!");
          const updatedNotes = archiveNotes.filter(
            (data) => data.id !== archive.id
          );
          setAcrchiveNotes(updatedNotes);
          setNotes((prevArr) => [data.data.data, ...prevArr]);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.status, error.response.data.message);
    }
  };

  const deleteNote = async (archive) => {
    try {
      const formData = new FormData();
      formData.append("title", archive.title);
      formData.append("content", archive.content);
      formData.append("isPin", archive.isPin);
      formData.append("isArchived", archive.isArchived);
      formData.append("isRemoved", !archive.isRemoved);
      formData.append("deleteImageIds", JSON.stringify([]));
      formData.append("images", archive.images);
      setIsLoading(true);
      let data = await editNoteService(
        archive.id,
        formData,
        accessToken,
        axiosJWT
      );
      setIsLoading(false);
      if (data) {
        if (data.data.data.isRemoved) {
          toast.success("Remove note to bin trash successfully!");
          const updatedNotes = archiveNotes.filter(
            (data) => data.id !== archive.id
          );
          setAcrchiveNotes(updatedNotes);
          setDeleteNotes((prevArr) => [data.data.data, ...prevArr]);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.status, error.response.data.message);
    }
  };

  return (
    <StyledCard>
      {archive.images && archive.images.length > 0 && (
        <CardContent
          // onClick={handleOpenEditNote}
          style={{
            paddingBottom: "0",
            paddingRight: "32px",
          }}
        >
          <Grid container spacing={archive.images.length}>
            {archive.images.map((image, index) => (
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
          {archive.title}
        </Typography>
        <Typography
          gutterBottom
          style={{
            padding: "4px 10px 0 0",
            cursor: "pointer",
          }}
        >
          {archive.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Unarchive
          fontSize="small"
          style={{ marginLeft: "auto" }}
          onClick={() => unArchiveNote(archive)}
          sx={{
            "&:hover": {
              background: "#848687",
              borderRadius: "50%",
              cursor: "pointer",
            },
          }}
        />
        <Delete
          fontSize="small"
          onClick={() => deleteNote(archive)}
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

export default Archive;

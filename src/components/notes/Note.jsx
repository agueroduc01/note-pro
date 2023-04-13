import { useContext, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ArchiveOutlined as Archive,
  DeleteOutlineOutlined as Delete,
} from "@mui/icons-material";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

import { DataContext } from "../../context/DataProvider";

import EditNoteModal from "./EditNoteModal";
import { editNoteService } from "../../services/note";
import { toast } from "react-toastify";
import AddMember from "../member/AddMember";
import { useSelector } from "react-redux";
import { createAxios } from "../../utils/createInstance";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";

const StyledCard = styled(Card)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  min-width: 240px;
  margin: 8px;
  box-shadow: none;
`;

const Note = ({ note }) => {
  const { notes, setNotes, setAcrchiveNotes, setDeleteNotes, setIsLoading } =
    useContext(DataContext);
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const [openEditNote, setOpenEditNote] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(accessToken, dispatch, loginSuccess);

  useEffect(() => {
    return () => {
      console.log("Cleanup notes");
    };
  }, []);

  const archiveNote = async (note) => {
    try {
      const formData = new FormData();
      formData.append("title", note.title);
      formData.append("content", note.content);
      formData.append("isPin", note.isPin);
      formData.append("isArchived", !note.isArchived);
      formData.append("isRemoved", note.isRemoved);
      formData.append("deleteImageIds", JSON.stringify([]));
      formData.append("images", note.images);
      setIsLoading(true);
      let data = await editNoteService(
        note.id,
        formData,
        accessToken,
        axiosJWT
      );
      setIsLoading(false);
      if (data) {
        if (data.data.data.isArchived === true) {
          toast.success("Archive successfully!");
          const updatedNotes = notes.filter((data) => data.id !== note.id);
          setNotes(updatedNotes);
          setAcrchiveNotes((prevArr) => [data.data.data, ...prevArr]);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.status, error.response.data.message);
    }
  };

  const deleteNote = async (note) => {
    try {
      const formData = new FormData();
      formData.append("title", note.title);
      formData.append("content", note.content);
      formData.append("isPin", note.isPin);
      formData.append("isArchived", note.isArchived);
      formData.append("isRemoved", !note.isRemoved);
      formData.append("deleteImageIds", JSON.stringify([]));
      formData.append("images", note.images);
      setIsLoading(true);
      let data = await editNoteService(
        note.id,
        formData,
        accessToken,
        axiosJWT
      );
      setIsLoading(false);
      if (data) {
        if (data.data.data.isRemoved === true) {
          toast.success("Remove note to bin trash successfully!");
        }
        const updatedNotes = notes.filter((data) => data.id !== note.id);
        setNotes(updatedNotes);
        setDeleteNotes((prevArr) => [data.data.data, ...prevArr]);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.status, error.response.data.message);
    }
  };

  const handleOpenEditNote = () => {
    setOpenEditNote(true);
  };

  const handleToggleIsPin = async () => {
    try {
      const formData = new FormData();
      formData.append("title", note.title);
      formData.append("content", note.content);
      formData.append("isPin", !note.isPin);
      formData.append("isArchived", note.isArchived);
      formData.append("isRemoved", note.isRemoved);
      formData.append("deleteImageIds", JSON.stringify([]));
      formData.append("images", note.images);
      setIsLoading(true);
      let data = await editNoteService(
        note.id,
        formData,
        accessToken,
        axiosJWT
      );
      setIsLoading(false);
      if (data) {
        if (data.data.data.isPin) {
          toast.success("Pin successfully");
        } else {
          toast.success("Unpin successfully");
        }
        const updatedPinNotes = notes.filter((data) => data.id !== note.id);
        updatedPinNotes.push(data.data.data);
        setNotes(updatedPinNotes);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.status, error.response.data.message);
    }
  };

  const handleClickAddPhoto = (note) => {
    let inputTag = document
      .getElementById(`${note.id}`)
      .querySelector(".inputImages");
    inputTag.click();
  };

  const onChangeImage = async () => {
    const formData = new FormData();
    let inputTag = document
      .getElementById(`${note.id}`)
      .querySelector(".inputImages");
    console.log(inputTag.files);
    const images = inputTag.files;
    if (images.length > 0) {
      setIsLoading(true);
      formData.append("title", note.title);
      formData.append("content", note.content);
      formData.append("isPin", note.isPin);
      formData.append("isArchived", note.isArchived);
      formData.append("isRemoved", note.isRemoved);
      formData.append("deleteImageIds", JSON.stringify([]));
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
      try {
        let data = await editNoteService(
          note.id,
          formData,
          accessToken,
          axiosJWT
        );
        setIsLoading(false);

        // PREVIEW IMAGES , CLEANUP WHEN DELETE NOTE

        const updatedPinNotes = notes.filter((data) => data.id !== note.id);
        updatedPinNotes.push(data.data.data);
        setNotes(updatedPinNotes);
        toast.success("Upload successfully!");
      } catch (error) {
        toast.error(error.response.status, error.response.data.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <StyledCard style={{ position: "relative" }} id={note.id}>
        {note.images && note.images.length > 0 && (
          <CardContent
            onClick={handleOpenEditNote}
            style={{
              paddingBottom: "0",
              paddingRight: "32px",
            }}
          >
            <Grid container spacing={note.images.length}>
              {note.images.map((image, index) => (
                <Grid
                  item
                  key={index}
                  // xs={Math.round(12 / note.images.length)}
                  // md={Math.round(12 / note.images.length)}
                  style={{ height: "220px" }}
                >
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

        <CardContent onClick={handleOpenEditNote}>
          <Typography
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              padding: "2px 10px 0 0",
            }}
          >
            {note.title}
          </Typography>
          <Typography
            gutterBottom
            style={{
              padding: "4px 10px 0 0",
            }}
          >
            {note.content}
          </Typography>
        </CardContent>
        <CardActions
          sx={{ "&:hover": { background: "#848687", borderRadius: "50%" } }}
          style={{ display: "flex", position: "absolute", top: 0, right: 0 }}
        >
          {note.isPin ? (
            <PushPinIcon onClick={() => handleToggleIsPin()} />
          ) : (
            <PushPinOutlinedIcon onClick={() => handleToggleIsPin()} />
          )}
        </CardActions>
        <CardActions>
          <GroupAddOutlinedIcon
            aria-label="Add Member"
            sx={{
              "&:hover": {
                background: "#848687",
                borderRadius: "50%",
              },
            }}
            fontSize="small"
            style={{
              marginLeft: "auto",
            }}
            onClick={() => setOpenAddMember(true)}
          />
          <AddPhotoAlternateOutlinedIcon
            fontSize="small"
            sx={{
              "&:hover": { background: "#848687", borderRadius: "50%" },
            }}
            style={{ marginLeft: "4px" }}
            onClick={() => handleClickAddPhoto(note)}
          />
          <input
            className="inputImages"
            type="file"
            name="myImage"
            accept=".jpg,.jpeg,.png"
            style={{ display: "none" }}
            multiple
            onChange={() => onChangeImage()}
          />
          <Archive
            fontSize="small"
            sx={{ "&:hover": { background: "#848687", borderRadius: "50%" } }}
            style={{ marginLeft: "4px" }}
            onClick={() => archiveNote(note)}
          />
          <Delete
            fontSize="small"
            sx={{ "&:hover": { background: "#848687", borderRadius: "50%" } }}
            style={{ marginLeft: "4px" }}
            onClick={() => deleteNote(note)}
          />
        </CardActions>
      </StyledCard>
      {accessToken && openEditNote && (
        <EditNoteModal
          open={openEditNote}
          handleCloseFromParent={setOpenEditNote}
          note={note}
        />
      )}
      {accessToken && openAddMember && (
        <AddMember
          open={openAddMember}
          handleCloseFromParent={setOpenAddMember}
          note={note}
        />
      )}
    </>
  );
};

export default Note;

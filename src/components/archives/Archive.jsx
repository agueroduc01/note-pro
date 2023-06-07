import { useContext, useState } from "react";

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
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";

import { DataContext } from "../../context/DataProvider";
import { editNoteService } from "../../services/note";
import { useSelector } from "react-redux";
import { createAxios } from "../../utils/createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import EditNoteModal from "../notes/EditNoteModal";
import AddMember from "../member/AddMember";

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
    notes,
    setNotes,
    setAcrchiveNotes,
    setDeleteNotes,
    setIsLoading,
  } = useContext(DataContext);
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const [openEditNote, setOpenEditNote] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);
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

  const handleOpenEditNote = () => {
    setOpenEditNote(true);
  };

  const handleClickAddPhoto = (archive) => {
    let inputTag = document
      .getElementById(`${archive.id}`)
      .querySelector(".inputImages");
    inputTag.click();
  };

  const onChangeImage = async () => {
    const formData = new FormData();
    let inputTag = document
      .getElementById(`${archive.id}`)
      .querySelector(".inputImages");
    console.log(inputTag.files);
    const images = inputTag.files;
    if (images.length > 0) {
      setIsLoading(true);
      formData.append("title", archive.title);
      formData.append("content", archive.content);
      formData.append("isPin", archive.isPin);
      formData.append("isArchived", archive.isArchived);
      formData.append("isRemoved", archive.isRemoved);
      formData.append("deleteImageIds", JSON.stringify([]));
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
      try {
        let data = await editNoteService(
          archive.id,
          formData,
          accessToken,
          axiosJWT
        );
        setIsLoading(false);

        // PREVIEW IMAGES , CLEANUP WHEN DELETE NOTE

        const updatedPinNotes = archiveNotes.filter(
          (data) => data.id !== archive.id
        );
        updatedPinNotes.push(data.data.data);
        setNotes(updatedPinNotes);
        toast.success("Upload successfully!");
      } catch (error) {
        toast.error(error.response.status, error.response.data.message);
        setIsLoading(false);
      }
    }
  };

  const handleToggleIsPin = async () => {
    try {
      const formData = new FormData();
      formData.append("title", archive.title);
      formData.append("content", archive.content);
      formData.append("isPin", !archive.isPin);
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
        toast.success("Unarchived and pin the note!");
        const updatedPinArchivedNotes = archiveNotes.filter(
          (data) => data.id !== archive.id
        );
        setAcrchiveNotes(updatedPinArchivedNotes);
        const updatedPinNotes = notes.filter((data) => data.id !== archive.id);
        updatedPinNotes.push(data.data.data);
        setNotes(updatedPinNotes);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.status, error.response.data.message);
    }
  };

  return (
    <>
      <StyledCard style={{ position: "relative" }} id={archive.id}>
        {archive.images && archive.images.length > 0 && (
          <CardContent
            onClick={handleOpenEditNote}
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
        <CardContent onClick={handleOpenEditNote}>
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
        <CardActions
          sx={{ "&:hover": { background: "#848687", borderRadius: "50%" } }}
          style={{ display: "flex", position: "absolute", top: 0, right: 0 }}
        >
          {archive.isPin ? (
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
            onClick={() => handleClickAddPhoto(archive)}
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
          <Unarchive
            fontSize="small"
            style={{ marginLeft: "4px" }}
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
      {accessToken && openEditNote && (
        <EditNoteModal
          open={openEditNote}
          handleCloseFromParent={setOpenEditNote}
          note={archive}
        />
      )}
      {accessToken && openAddMember && (
        <AddMember
          open={openAddMember}
          handleCloseFromParent={setOpenAddMember}
          note={archive}
        />
      )}
    </>
  );
};

export default Archive;

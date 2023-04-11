import { useContext, useState } from "react";
import {
  TextField,
  Dialog,
  CardContent,
  CardActions,
  Grid,
  DialogContent,
} from "@mui/material";
import {
  ArchiveOutlined as Archive,
  DeleteOutlineOutlined as Delete,
} from "@mui/icons-material";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

import { DataContext } from "../../context/DataProvider";
import { editNoteService } from "../../services/note";

import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import AddMember from "../member/AddMember";
import { useSelector } from "react-redux";

const EditNoteModal = (props) => {
  const { open, handleCloseFromParent, note } = props;
  const {
    notes,
    setNotes,
    setAcrchiveNotes,
    setDeleteNotes,
    isLoading2,
    setIsLoading2,
  } = useContext(DataContext);
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const [title, setTile] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isPin, setIsPin] = useState(note.isPin);
  const [images, setImages] = useState(note.images);
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [openAddMember, setOpenAddMember] = useState(false);

  const handleClose = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("isPin", isPin);
      formData.append("deleteImageIds", JSON.stringify(deleteImageIds));
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
        // clean up
        if (images[i].url.includes("localhost")) {
          URL.revokeObjectURL(images[i].url);
        }
      }
      setIsLoading2(true);
      let data = await editNoteService(note.id, formData, accessToken);
      setIsLoading2(false);
      toast.success(data.data.message);
      handleCloseFromParent(false);
      if (data.data) {
        const updatedPinNotes = notes.filter((data) => data.id !== note.id);
        updatedPinNotes.push(data.data.data);
        setNotes(updatedPinNotes);
      }
    } catch (error) {
      setIsLoading2(false);
      toast.error(error.response);
    }
  };

  const archiveNote = (note) => {
    handleCloseFromParent(false);
    const updatedNotes = notes.filter((data) => data.id !== note.id);
    setNotes(updatedNotes);
    setAcrchiveNotes((prevArr) => [note, ...prevArr]);
  };

  const deleteNote = (note) => {
    handleCloseFromParent(false);
    const updatedNotes = notes.filter((data) => data.id !== note.id);
    setNotes(updatedNotes);
    setDeleteNotes((prevArr) => [note, ...prevArr]);
  };

  const handleClickAddPhoto = (note) => {
    let inputTag = document
      .querySelector(`[data-id='${note.id}'`)
      .querySelector(".inputImages");
    inputTag.click();
  };

  const onChangeImage = async () => {
    let inputTag = document
      .querySelector(`[data-id='${note.id}'`)
      .querySelector(".inputImages");
    console.log(inputTag.files);
    const imagesChoosen = inputTag.files;
    if (imagesChoosen.length > 0) {
      setIsLoading2(true);
      for (let i = 0; i < imagesChoosen.length; i++) {
        let file = imagesChoosen[i];
        file.url = URL.createObjectURL(file);
        setImages((prevArr) => [file, ...prevArr]);
      }
      toast.success("Upload successfully!");
      setIsLoading2(false);
    }
  };
  console.log("images", open, images.length);

  const handleToggleIsPin = async () => {
    setIsPin(!isPin);
    if (isPin) {
      toast.success("Pin successfully");
    } else {
      toast.success("Unpin successfully");
    }
  };

  const handleDeleteImg = (image) => {
    // const img = document.getElementById(`${image.id}`);
    const updateImages = images.filter((data) => data.id !== image.id);
    setImages(updateImages);
    if (image.id) {
      setDeleteImageIds((prevArr) => [...prevArr, image.id]);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        data-id={note.id}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "680px",
            },
          },
        }}
      >
        <DialogContent>
          {images && images.length > 0 && (
            <CardContent
              style={{
                padding: 4,
              }}
            >
              <Grid
                container
                spacing={images.length}
                style={{
                  width: "100%",
                  position: "relative",
                }}
                // window.onbeforeunload = function() {}
              >
                {images.map((image, index) => (
                  <Grid
                    item
                    key={index}
                    style={{
                      height: images.length > 1 ? "220px" : "100%",
                      position: "relative",
                    }}
                    sx={{
                      "&:hover": {
                        opacity: 0.8,
                        cursor: "pointer",
                      },
                    }}
                    id={image.id}
                  >
                    <img
                      src={image.url}
                      alt="images"
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    />
                    <DeleteOutlineOutlinedIcon
                      sx={{
                        "&:hover": {
                          opacity: 1,
                          color: "red",
                        },
                      }}
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 3,
                      }}
                      onClick={() => handleDeleteImg(image)}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          )}
          <CardContent style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              placeholder="Title"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: { fontSize: "1.5rem", fontWeight: 500 },
              }}
              onChange={(e) => setTile(e.target.value)}
              value={title}
            />
            <TextField
              placeholder="Content"
              multiline
              maxRows={Infinity}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </CardContent>
          <CardActions
            sx={{
              "&:hover": {
                background: "#848687",
                borderRadius: "50%",
                cursor: "pointer",
              },
            }}
            style={{
              display: "flex",
              position: "absolute",
              top: 5,
              right: 10,
            }}
          >
            {isPin ? (
              <PushPinIcon
                style={{
                  height: "30px",
                  width: "30px",
                }}
                onClick={() => handleToggleIsPin()}
              />
            ) : (
              <PushPinOutlinedIcon
                style={{
                  height: "30px",
                  width: "30px",
                }}
                onClick={() => handleToggleIsPin()}
              />
            )}
          </CardActions>
          <CardActions style={{ height: "30px" }}>
            <GroupAddOutlinedIcon
              aria-label="Add Member"
              sx={{
                "&:hover": {
                  background: "#848687",
                  borderRadius: "50%",
                  cursor: "pointer",
                },
              }}
              fontSize="small"
              style={{
                marginLeft: "auto",
                height: "30px",
                width: "30px",
              }}
              onClick={() => setOpenAddMember(true)}
            />
            <AddPhotoAlternateOutlinedIcon
              fontSize="small"
              sx={{
                "&:hover": {
                  background: "#848687",
                  borderRadius: "50%",
                  cursor: "pointer",
                },
              }}
              style={{ marginLeft: "4px", height: "30px", width: "30px" }}
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
              style={{ marginLeft: "4px", height: "30px", width: "30px" }}
              onClick={() => archiveNote(note)}
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
              style={{
                height: "30px",
                width: "30px",
              }}
              onClick={() => deleteNote(note)}
              sx={{
                "&:hover": {
                  background: "#848687",
                  borderRadius: "50%",
                  cursor: "pointer",
                },
              }}
            />
          </CardActions>
          <LoadingButton
            color="primary"
            onClick={handleClose}
            endIcon={<SendIcon />}
            loading={isLoading2}
            loadingPosition="end"
            variant="contained"
          >
            <span>Close</span>
          </LoadingButton>
        </DialogContent>
      </Dialog>
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

export default EditNoteModal;

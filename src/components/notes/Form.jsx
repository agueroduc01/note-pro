import { useState, useRef, useContext } from "react";

import {
  Box,
  TextField,
  ClickAwayListener,
  CardActions,
  CardContent,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { v4 as uuid } from "uuid";

import { DataContext } from "../../context/DataProvider";
import { createAxios } from "../../utils/createInstance";
import { addNoteService } from "../../services/note";
import { toast } from "react-toastify";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  margin: auto;
  box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);
  border-color: #e0e0e0;
  width: 600px;
  border-radius: 8px;
  min-height: 30px;
  padding: 10px 15px;
`;

const note = {
  id: "",
  title: "",
  content: "",
  isPin: false,
  images: null,
};

const Form = () => {
  const [showTextField, setShowTextField] = useState(false);
  const [addNote, setAddNote] = useState({ ...note, id: uuid() });
  const [images, setImages] = useState([]);

  const { setNotes, setIsLoading } = useContext(DataContext);
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.login.accessToken);
  let axiosJWT = createAxios(accessToken, dispatch, loginSuccess);

  const containerRef = useRef();

  const handleClickAway = async () => {
    setShowTextField(false);
    containerRef.current.style.minheight = "30px";
    setAddNote({ ...note, id: uuid() });

    if (addNote.title || addNote.content || images.length > 0) {
      try {
        const formData = new FormData();
        formData.append("id", addNote.id);
        formData.append("title", addNote.title);
        formData.append("content", addNote.content);
        formData.append("isPin", addNote.isPin);
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
          // clean up
          if (images[i].url.includes("localhost")) {
            URL.revokeObjectURL(images[i].url);
          }
        }
        setIsLoading(true);
        let data = await addNoteService(formData, accessToken, axiosJWT);
        setIsLoading(false);
        setNotes((prevArr) => [data.data.data, ...prevArr]);
        setImages([]);
        toast.success(data.data.message);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    }
  };

  const onTextAreaClick = () => {
    setShowTextField(true);
    containerRef.current.style.minheight = "70px";
  };

  const onTextChange = (e) => {
    let changedNote = { ...addNote, [e.target.name]: e.target.value };
    setAddNote(changedNote);
  };

  const handleClickAddPhoto = () => {
    let inputTag = document.getElementById("inputImages");
    inputTag.click();
  };

  const onChangeImage = async () => {
    let inputTag = document.getElementById("inputImages");
    console.log(inputTag.files);
    const imagesChoosen = inputTag.files;
    if (imagesChoosen.length > 0) {
      setIsLoading(true);
      for (let i = 0; i < imagesChoosen.length; i++) {
        let file = imagesChoosen[i];
        file.url = URL.createObjectURL(file);
        setImages((prevArr) => [file, ...prevArr]);
      }
      toast.success("Upload successfully!");
      setIsLoading(false);
    }
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Container ref={containerRef}>
          {showTextField && images && images.length > 0 && (
            <CardContent
              style={{
                padding: 0,
              }}
            >
              <Grid
                container
                spacing={images.length}
                style={{
                  maxWidth: images.length < 3 ? "620px" : "820px",
                }}
              >
                {images.map((image, index) => (
                  <Grid item key={index} style={{ height: "220px" }}>
                    <img
                      src={image.url}
                      alt="images"
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          )}
          {showTextField && (
            <>
              <TextField
                placeholder="Title"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  style: { fontSize: "1.5rem", fontWeight: 500 },
                }}
                style={{ marginBottom: 10 }}
                onChange={(e) => onTextChange(e)}
                name="title"
                value={addNote.title}
              />
            </>
          )}
          <TextField
            placeholder="Take a note..."
            multiline
            maxRows={Infinity}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            onClick={onTextAreaClick}
            onChange={(e) => onTextChange(e)}
            name="content"
            value={addNote.content}
          />
          {showTextField && (
            <CardActions>
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
                }}
                // onClick={() => setOpenAddMember(true)}
              />
              <AddPhotoAlternateOutlinedIcon
                fontSize="small"
                sx={{
                  cursor: "pointer",
                  "&:hover": { background: "#848687", borderRadius: "50%" },
                }}
                style={{ marginLeft: "4px" }}
                onClick={() => handleClickAddPhoto(addNote)}
              />
              <input
                id="inputImages"
                type="file"
                name="myImage"
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
                multiple
                onChange={() => onChangeImage()}
              />
            </CardActions>
          )}
        </Container>
      </ClickAwayListener>
    </>
  );
};

export default Form;

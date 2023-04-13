import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { changeInfoService } from "../../../services/user";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { createAxios } from "../../../utils/createInstance";
import { loginSuccess } from "../../../redux/authSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const ChangeInfo = (props) => {
  const { open, handleCloseFromParent, updateUser } = props;
  const [fullName, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(accessToken, dispatch, loginSuccess);

  const handleChangeInfor = async () => {
    if (phoneNumber && phoneNumber.substring(0, 1) === "0") {
      try {
        let data = await changeInfoService(
          fullName,
          phoneNumber,
          accessToken,
          axiosJWT
        );
        console.log("change info", data);
        if (data) {
          updateUser(data.data.data);
          toast.success(data.data.message);
          handleClose();
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error.response);
      }
    } else {
      toast.error("First character of phoneNumber must be '0'");
    }
  };

  const handleClose = () => {
    handleCloseFromParent(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5">CHANGE INFORMATION</Typography>
          <TextField
            style={{ marginTop: "24px", width: "80%" }}
            variant="outlined"
            label="Fullname"
            placeholder="Enter your new full name here..."
            type="text"
            onChange={(e) => setFullname(e.target.value)}
            inputProps={{
              fontSize: "24px",
            }}
          />

          <TextField
            style={{ marginTop: "24px", width: "80%" }}
            variant="outlined"
            label="Phone number"
            placeholder="Enter your new phone number here..."
            type="text"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button
            onClick={handleChangeInfor}
            style={{ marginTop: "20px" }}
            color="primary"
          >
            Change
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ChangeInfo;

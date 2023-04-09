import { Modal, Box, Typography, Input, Button } from "@mui/material";
import { useContext, useState } from "react";
import { DataContext } from "../../../context/DataProvider";
import {
  changePasswordService,
  getAccessTokenService,
} from "../../../services/user";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const ChangePassword = (props) => {
  const { open, handleCloseFromParent } = props;
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const { accessToken, setAccessToken } = useContext(DataContext);

  const handleChangePassword = async () => {
    try {
      let data = await changePasswordService(
        newPassword,
        oldPassword,
        accessToken
      );
      if (data) {
        let newAccessToken = await getAccessTokenService(
          data.data.refreshToken
        );
        setAccessToken(newAccessToken.data.data);
        console.log("changePassword", data, data.data.message);
        handleClose();
      }
    } catch (error) {
      console.log(error.response.status, error.response.data.message);
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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Old Password
          </Typography>
          <Input
            label="Your old password"
            placeholder="Enter your old password here..."
            type="text"
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            New Password
          </Typography>
          <Input
            label="Your new password"
            placeholder="Enter your new password here..."
            type="text"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={handleChangePassword} style={{ marginTop: "20px" }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ChangePassword;

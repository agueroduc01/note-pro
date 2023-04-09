import { useState } from "react";
import { Button, Modal, Box, Typography, Input } from "@mui/material";
import { resetPasswordService } from "../../services/user";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ChildModal = (props) => {
  const { open, handleCloseFromParent, handleCloseParentSendmail } = props;
  const [codeVerify, setCodeVerify] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleVerify = async () => {
    if (codeVerify && newPassword) {
      try {
        const data = await resetPasswordService(codeVerify, newPassword);
        if (data.data && data.status === 200) {
          handleCloseFromParent(false);
          handleCloseParentSendmail(false);
        }
        // console.log(data.data.message);
        toast.success(data.data.message);
      } catch (error) {
        // console.log(error.response.data.message, error.response.status);
        toast.error(error.response.data.message, error.response.status);
      }
    } else {
      toast.error("All inputs are required");
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
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <Typography variant="h6" component="h2">
            CodeVerify Here
          </Typography>
          <Input
            label="Your code verify"
            type="text"
            onChange={(e) => setCodeVerify(e.target.value)}
          />

          <Typography variant="h6" component="h2">
            New Password
          </Typography>
          <Input
            label="Your new password"
            type="text"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button onClick={handleVerify}>Verify</Button>
        </Box>
      </Modal>
    </>
  );
};

export default ChildModal;

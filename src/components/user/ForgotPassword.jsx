import { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { forgotPasswordService } from "../../services/user";
import ResetPassword from "./ResetPassword";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const ForgotPassword = (props) => {
  const { open, handleCloseFromParent } = props;
  const [email, setEmail] = useState("");
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const handleClose = () => {
    handleCloseFromParent(false);
  };

  const handleForgotPassword = async () => {
    if (email) {
      try {
        const data = await forgotPasswordService(email);
        if (data.data && data.status === 200) {
          setOpenResetPassword(true);
        }
        // console.log(data.data.message);
        toast.success(data.data.message);
      } catch (error) {
        // console.log(error.response.data.message, error.response.status);
        toast.error(error.response.data.message, error.response.status);
      }
    } else {
      toast.error("Please enter your email");
    }
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
          <Typography
            variant="h4"
            component="h1"
            sx={{
              "@keyframes wave": {
                "0%": {
                  backgroundPosition: "0 0",
                },
                "100%": {
                  backgroundPosition: "50vw 10px",
                },
              },
            }}
            style={{
              marginBottom: "32px",
              background:
                "linear-gradient(to right, rgba(255, 215, 255, 0) 0%, rgba(225, 255, 255, 0.5) 20%, rgba(255, 255, 255, 0) 61%), linear-gradient(rgb(97, 183, 217) 52%, rgb(224, 246, 255) 60%, rgb(78, 99, 132) 61%)" /* you can change the colors based on your preference */,
              backgroundClip:
                "text" /*it defines how far the background should extend within an element, here we set it to text */,
              // -webkit-background-clip: "text", /*for browsers compatibility */
              // -webkit-text-fill-color: "transparent", /* specifies the fill color of text characters. We use transparent to use the background as our text fill  */
              animation: "wave 2000ms ease alternate infinite",
              transition: "all 0.4s ease",
            }}
          >
            Forgot Password
          </Typography>
          <Typography variant="h6" component="h2">
            Enter your email is verified below then click "SEND MAIL". We will
            send you a new password immediately.
          </Typography>
          <TextField
            label="Your email"
            variant="filled"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: "18px", width: "100%" }}
          />

          <Button
            variant="outlined"
            onClick={handleForgotPassword}
            style={{ width: "50%", marginTop: "32px" }}
          >
            Send mail
          </Button>

          {openResetPassword && (
            <ResetPassword
              open={openResetPassword}
              handleCloseFromParent={setOpenResetPassword}
              handleCloseParentSendmail={handleClose}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ForgotPassword;

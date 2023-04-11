import { Modal, Box, Typography, Input, Button } from "@mui/material";
import { useState } from "react";
import {
  changePasswordService,
  getAccessTokenService,
} from "../../../services/user";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  loginFailed,
  loginStart,
  loginSuccess,
} from "../../../redux/authSlice";
import { setCookie } from "../../../utils/common-utils";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { red } from "@mui/material/colors";
import { createAxios } from "../../../utils/createInstance";

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
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const isLoading = useSelector((state) => state.user.login.isFetching);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(accessToken, dispatch, loginSuccess);

  const handleChangePassword = async () => {
    try {
      dispatch(loginStart());
      let data = await changePasswordService(
        newPassword,
        oldPassword,
        accessToken,
        axiosJWT
      );
      if (data) {
        setCookie("refreshToken", data.data.data, 7);
        let newAccessToken = await getAccessTokenService(data.data.data);
        dispatch(loginSuccess(newAccessToken.data.data));
        toast.success(data.data.message);
        handleClose();
      }
    } catch (error) {
      dispatch(loginFailed());
      toast.error(error.response.data.message);
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
          <div
            style={{
              display: "flex",
              marginTop: "24px",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Button
              disabled={isLoading}
              onClick={handleClose}
              style={{ backgroundColor: red[500] }}
              variant="contained"
            >
              Cancel
            </Button>
            <LoadingButton
              color="primary"
              onClick={handleChangePassword}
              loading={isLoading}
              variant="contained"
            >
              <span>Submit</span>
            </LoadingButton>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ChangePassword;

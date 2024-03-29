import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
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
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

const ChangePassword = (props) => {
  const { open, handleCloseFromParent } = props;
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const isLoading = useSelector((state) => state.user.login.isFetching);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(accessToken, dispatch, loginSuccess);

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const handleClickShowPasswordAgain = () =>
    setShowPasswordAgain((showPassword) => !showPassword);

  const handleClickShowOldPassword = () =>
    setShowOldPassword((showOldPassword) => !showOldPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
          <Typography variant="h5">CHANGE PASSWORD</Typography>
          <form
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              style={{ marginTop: "24px", width: "80%", display: "none" }}
              variant="outlined"
              id="userName"
              name="username"
              autoComplete="username"
              value=""
              type="text"
            />
            <TextField
              style={{ marginTop: "24px", width: "80%" }}
              label="Current Password"
              type={showOldPassword ? "text" : "password"}
              variant="outlined"
              onChange={(e) => setOldPassword(e.target.value)}
              autoComplete="old-password"
              InputProps={{
                style: { fontSize: "16px" },
                endAdornment: (
                  <InputAdornment position="end" variant="standard">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowOldPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              style={{ marginTop: "24px", width: "80%" }}
              label="New Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              InputProps={{
                style: { fontSize: "16px" },
                endAdornment: (
                  <InputAdornment position="end" variant="standard">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="new-password-again"
              style={{ marginTop: "24px", width: "80%" }}
              label="New Password Again"
              variant="outlined"
              error={
                newPasswordAgain !== "" && newPasswordAgain !== newPassword
              }
              helperText={
                newPasswordAgain !== "" && newPasswordAgain !== newPassword
                  ? "New Password Again Not Match"
                  : ""
              }
              type={showPasswordAgain ? "text" : "password"}
              onChange={(e) => setNewPasswordAgain(e.target.value)}
              autoComplete="new-password-again"
              InputProps={{
                style: { fontSize: "16px" },
                endAdornment: (
                  <InputAdornment position="end" variant="standard">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordAgain}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPasswordAgain ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
          <div
            style={{
              marginTop: "24px",
            }}
          >
            <Button
              disabled={isLoading}
              onClick={handleClose}
              style={{ backgroundColor: red[500], marginRight: "24px" }}
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

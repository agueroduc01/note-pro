import {
  Button,
  Grid,
  Typography,
  FormControl,
  FormHelperText,
  InputAdornment,
  IconButton,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { getAccessTokenService, loginService } from "../../services/user";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import Loading from "../loading/Loading";
import { setCookie } from "../../utils/common-utils";
import { useDispatch } from "react-redux";
import { loginFailed, loginStart, loginSuccess } from "../../redux/authSlice";
import { useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const [errMessage, setErrorMessage] = useState("");
  const [openModalRegister, setOpenModalRegister] = useState(false);
  const [openModalForgotPasword, setOpenModalForgotPasword] = useState(false);
  const isLoading = useSelector((state) => state.user.login.isFetching);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleClose = () => {
    setOpenModalRegister(false);
  };

  const handleFormLogin = async () => {
    if (email && password) {
      try {
        dispatch(loginStart());
        let data = await loginService(email, password);
        if (data) {
          setCookie("refreshToken", data.data.data, 7);
          setErrorMessage(data.data.message);
          let dataHaveAccessToken = await getAccessTokenService(data.data.data);
          if (dataHaveAccessToken) {
            dispatch(loginSuccess(dataHaveAccessToken.data.data));
            setTimeout(() => {
              nav("/", { replace: true });
            }, 1000);
          }
        }
      } catch (error) {
        setErrorMessage(error.response.data.message);
        console.log(error.response.data);
        dispatch(loginFailed());
      }
    }
  };

  return (
    <>
      <Grid container spacing={2} style={{ height: "100vh" }}>
        <Grid item xs={6}>
          <div
            style={{
              height: "100%",
            }}
          >
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              alt="SampleImage"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
                objectPosition: "left",
              }}
            />
          </div>
        </Grid>
        <Grid item xs={6} style={{ height: "100%", width: "100%" }}>
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              padding: "40px 0px",
            }}
          >
            <div>
              <Typography variant="h5">Sign in with</Typography>
              <Button variant="text">
                <FacebookTwoToneIcon
                  style={{ fontSize: "40px", color: "#4267B2" }}
                />
              </Button>
              <Button variant="text">
                <TwitterIcon style={{ fontSize: "40px", color: "#1DA1F2" }} />
              </Button>
              <Button variant="text">
                <LinkedInIcon style={{ fontSize: "40px", color: " #0A66C2" }} />
              </Button>
              <Typography variant="h5" style={{ marginTop: "10px" }}>
                Or
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", width: "66%" }}>
                <AccountCircle
                  sx={{
                    color: "action.active",
                    mr: 1,
                    my: 0.5,
                    fontSize: "32px",
                  }}
                />
                <TextField
                  id="input-email"
                  label={
                    <Typography variant="headline" component="h3">
                      Your email
                    </Typography>
                  }
                  type="email"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "66%" }}
                  InputProps={{ style: { fontSize: "16px" } }}
                />
              </Box>
              <FormControl
                sx={{
                  m: 3,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "66%",
                  position: "relative",
                }}
                variant="standard"
              >
                <KeyOutlinedIcon
                  sx={{
                    color: "action.active",
                    mr: 1,
                    my: 0.5,
                    fontSize: "32px",
                  }}
                />
                <TextField
                  id="input-password"
                  label={
                    <Typography variant="headline" component="h3">
                      Your password
                    </Typography>
                  }
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "66%" }}
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
                <FormHelperText
                  style={{ position: "absolute", bottom: -30, left: 50 }}
                >
                  {errMessage}
                </FormHelperText>
              </FormControl>
            </div>
            <div>
              <FormControlLabel
                value="rememberMe"
                control={<Checkbox />}
                checked={checked}
                onChange={handleChange}
                label={<Typography variant="h6">Remember me</Typography>}
                labelPlacement="end"
              />
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setOpenModalForgotPasword(true);
                  console.info("I'm a button.");
                }}
              >
                <Typography variant="h6">Forgot Password?</Typography>
              </Link>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                onClick={handleFormLogin}
                sx={{
                  backgroundColor: "rgb(91, 144, 114)",
                  "&:hover": {
                    backgroundColor: "rgb(144 196 167)",
                  },
                }}
                style={{ width: "50%" }}
              >
                Login
              </Button>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <Typography style={{ marginTop: "24px" }} variant="h6">
                  Don't have an account?
                </Typography>
                <Link
                  to="/register"
                  component="button"
                  variant="body2"
                  onClick={() => {
                    setOpenModalRegister(true);
                    console.info("I'm a button-account.");
                  }}
                  style={{ marginLeft: "16px" }}
                >
                  <Typography variant="h6">Register</Typography>
                </Link>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      {openModalRegister && (
        <Register open={openModalRegister} handleClose={handleClose} />
      )}
      {openModalForgotPasword && (
        <ForgotPassword
          open={openModalForgotPasword}
          handleCloseFromParent={setOpenModalForgotPasword}
        />
      )}
      {isLoading && <Loading />}
    </>
  );
};

export default Login;

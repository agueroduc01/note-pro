import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Avatar,
  IconButton,
  Snackbar,
} from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { detailService } from '../../../services/user';
import ChangeInfo from './ChangeInfo';
import ChangePassword from './ChangePassword';
import { useSelector } from 'react-redux';
import { createAxios } from '../../../utils/createInstance';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../redux/authSlice';
import Logout from './Logout';
import CloseIcon from '@mui/icons-material/Close';

const CardInfo = () => {
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const [detailUser, setDetailUser] = useState({});
  const [openChangeInfo, setOpenChangeInfo] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(accessToken, dispatch, loginSuccess);

  useEffect(() => {
    let ignore = false;

    const getDetailUser = async () => {
      try {
        let data = await detailService(accessToken, axiosJWT);
        if (!ignore) {
          setDetailUser(data.data.data);
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    getDetailUser();

    return () => {
      // setDetailUser({});
      ignore = true;
    };
    // eslint-disable-next-line
  }, [accessToken]);

  const handleCloseChangeInfo = () => {
    setOpenChangeInfo(false);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  const [openSetting, setOpenSetting] = useState(false);

  const handleClick = () => {
    setOpenSetting(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSetting(false);
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {detailUser &&
                (detailUser.fullName
                  ? detailUser.fullName.substring(0, 1)
                  : ' ')}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={detailUser.fullName}
          subheader={detailUser.phoneNumber}
        />
        <CardContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Button
            size="large"
            onClick={() => {
              setOpenChangeInfo(true);
            }}
          >
            Change Information
          </Button>
          <Button
            size="large"
            onClick={() => {
              setOpenChangePassword(true);
            }}
          >
            Change Password
          </Button>
          <Button
            color="error"
            size="large"
            onClick={() => setOpenLogout(true)}
          >
            <span>Log Out</span>
            <LogoutOutlinedIcon
              sx={{
                fontWeight: 300,
                marginLeft: 2,
                fontSize: 20,
              }}
            />
          </Button>
        </CardContent>
      </Card>
      {openChangeInfo && (
        <ChangeInfo
          open={openChangeInfo}
          handleCloseFromParent={handleCloseChangeInfo}
          updateUser={setDetailUser}
        />
      )}
      {openChangePassword && (
        <ChangePassword
          open={openChangePassword}
          handleCloseFromParent={handleCloseChangePassword}
        />
      )}
      {openLogout && (
        <Logout open={openLogout} handleCloseFromParent={setOpenLogout} />
      )}
      <Snackbar
        open={openSetting}
        autoHideDuration={4000}
        onClose={handleClose}
        message="This feature was maintained"
        action={action}
      />
    </>
  );
};

export default CardInfo;

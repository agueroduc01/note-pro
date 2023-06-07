import { Box, Button, Modal, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  logOutFailed,
  logOutStart,
  logOutSuccess,
} from '../../../redux/authSlice';
import { setCookie } from '../../../utils/common-utils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const Logout = (props) => {
  const { open, handleCloseFromParent } = props;
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const dispatch = useDispatch();

  const handleClose = () => {
    handleCloseFromParent(false);
  };

  const handleLogOut = () => {
    dispatch(logOutStart());
    if (accessToken) {
      // call API
      // if data from API success dispatch
      dispatch(logOutSuccess(null));
      setCookie('refreshToken', null, null);
    } else {
      dispatch(logOutFailed());
    }
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
          <div>
            <div>
              <Typography variant="h5" sx={{ fontFamily: 'revert-layer' }}>
                Are you sure you want to logout? You can't note anymore if you
                do.
              </Typography>
            </div>
            <div
              style={{
                width: '80%',
                margin: '20px 36px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button
                variant="outlined"
                color={'success'}
                onClick={handleLogOut}
              >
                Yes
              </Button>
              <Button variant="outlined" color={'error'} onClick={handleClose}>
                No
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Logout;

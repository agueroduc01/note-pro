import { useState } from 'react';
import {
  Button,
  Modal,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  TextField,
} from '@mui/material';
import { resetPasswordService } from '../../services/user';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ChildModal = (props) => {
  const { open, handleCloseFromParent, handleCloseParentSendmail } = props;
  const [codeVerify, setCodeVerify] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
      toast.error('All inputs are required');
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
          <TextField
            id="input-code-verification"
            label={
              <Typography variant="headline" component="h3">
                Your code
              </Typography>
            }
            style={{ marginBottom: '20px', marginTop: '20px' }}
            type="email"
            variant="outlined"
            onChange={(e) => setCodeVerify(e.target.value)}
            InputProps={{ style: { fontSize: '16px' } }}
          />

          <TextField
            id="input-password"
            label={
              <Typography variant="headline" component="h3">
                New password
              </Typography>
            }
            style={{ marginBottom: '20px' }}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              style: { fontSize: '16px' },
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

          <Button style={{ justifyContent: 'center' }} onClick={handleVerify}>
            Verify
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ChildModal;

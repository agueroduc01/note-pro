import { useState } from 'react';
import { Box, Button, TextField, Modal, Typography } from '@mui/material';
import { registerService } from '../../services/user';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const Register = (props) => {
  const { open, handleClose } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    try {
      const data = await registerService(email, password, fullname, phone);
      console.log(data);
      toast.success(data.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
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
          <Typography variant="h5" component="h1">
            Register
          </Typography>
          <TextField
            label="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: '24px', width: '100%' }}
          />
          <TextField
            label="Password"
            type="password"
            style={{ marginTop: '24px', width: '100%' }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Fullname"
            type="text"
            style={{ marginTop: '24px', width: '100%' }}
            onChange={(e) => setFullname(e.target.value)}
          />
          <TextField
            label="Phone number"
            type="text"
            style={{ marginTop: '24px', width: '100%' }}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button onClick={handleRegister} style={{ marginTop: '24px' }}>
            Register
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Register;

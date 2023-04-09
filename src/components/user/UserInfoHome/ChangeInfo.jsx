import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useContext, useState } from "react";
import { DataContext } from "../../../context/DataProvider";
import { changeInfoService } from "../../../services/user";
import { toast } from "react-toastify";

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

const ChangeInfo = (props) => {
  const { open, handleCloseFromParent, updateUser } = props;
  const [fullName, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { accessToken } = useContext(DataContext);

  const handleChangeInfor = async () => {
    try {
      let data = await changeInfoService(fullName, phoneNumber, accessToken);
      if (data) {
        updateUser(data.data.data);
        toast.success(data.data.message);
        handleClose();
      }
    } catch (error) {
      console.log(error.response);
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
          <Typography variant="h5">CHANGE INFORMATION</Typography>
          <TextField
            style={{ marginTop: "24px", width: "90%" }}
            variant="outlined"
            label="Fullname"
            placeholder="Enter your new full name here..."
            type="text"
            onChange={(e) => setFullname(e.target.value)}
            inputProps={{
              fontSize: "24px",
            }}
          />

          <TextField
            style={{ marginTop: "24px" }}
            variant="outlined"
            label="Phone number"
            placeholder="Enter your new phone number here..."
            type="text"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button onClick={handleChangeInfor} style={{ marginTop: "20px" }}>
            Change
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ChangeInfo;

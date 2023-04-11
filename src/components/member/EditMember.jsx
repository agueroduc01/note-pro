import { Box, Modal, Button, FormControl, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { MenuItem, Select, InputLabel } from "@mui/material";
import { red } from "@mui/material/colors";

import { useState } from "react";
import { editMemberService } from "../../services/member";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

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

const EditMember = (props) => {
  const { open, handleCloseFromParent, member, note, members, setMembers } =
    props;
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const [role, setRole] = useState(member.role);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleClose = () => {
    handleCloseFromParent(false);
  };

  const handleSubmitEdit = async () => {
    setLoading(true);
    try {
      let data = await editMemberService(note.id, accessToken, {
        ...member,
        role: role,
      });
      if (data) {
        setLoading(false);
        const updateMembers = members.filter(
          (member) => member.id !== data.data.data.id
        );
        updateMembers.push(data.data.data);
        setMembers(updateMembers);
        toast.success(data.data.message);
      }
    } catch (error) {
      toast.error(error.response.status, error.response.data);
    }
  };

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 240 }}>
          <Typography
            mt={2}
            style={{
              fontSize: "1.45rem",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {member.fullName}
          </Typography>
          <Typography
            mt={2}
            style={{
              fontSize: "1rem",
              fontWeight: "450",
              textAlign: "center",
            }}
          >
            {member.email}
          </Typography>
          <Typography
            mt={2}
            mb={3}
            style={{
              fontSize: "1rem",
              fontWeight: "450",
              textAlign: "center",
            }}
          >
            {note.id}
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 200, mb: 3 }}>
            <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value={"editor"}>Editor</MenuItem>
              <MenuItem value={"viewer"}>Viewer</MenuItem>
            </Select>
          </FormControl>
          <Button
            disabled={loading}
            onClick={handleClose}
            style={{ backgroundColor: red[500] }}
            variant="contained"
          >
            Cancel
          </Button>
          <LoadingButton
            color="primary"
            onClick={handleSubmitEdit}
            loading={loading}
            variant="contained"
            style={{
              position: "absolute",
              right: 25,
            }}
          >
            <span>Change</span>
          </LoadingButton>
        </Box>
      </Modal>
    </>
  );
};

export default EditMember;

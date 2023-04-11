import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import {
  addMemberService,
  deleteMemberService,
  getMembersService,
} from "../../services/member";
import { DataContext } from "../../context/DataProvider";
import { toast } from "react-toastify";
import EditMember from "./EditMember";
import { useSelector } from "react-redux";

const AddMember = (props) => {
  const { open, handleCloseFromParent, note } = props;
  const { isLoading2, setIsLoading2 } = useContext(DataContext);
  const accessToken = useSelector((state) => state.user.login.accessToken);
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [openEditMember, setOpenEditMember] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const divInputRef = useRef();

  useEffect(() => {
    const getMembers = async () => {
      try {
        let data = await getMembersService(accessToken, note.id, 0, 10);
        setMembers(data.data.data.data);
        toast.success(data.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getMembers();

    return () => {
      divInputRef.current = false;
    };
  }, [accessToken, note]);

  const handleClose = () => {
    handleCloseFromParent(false);
  };

  const handleAddMember = async () => {
    setIsLoading2(true);
    try {
      let data = await addMemberService(note.id, accessToken, {
        email,
        role: "editor",
      });
      setIsLoading2(false);
      toast.success(data.data.message);
      setMembers([...members, data.data.data]);
      divInputRef.current.querySelector("input").value = "";
      divInputRef.current.querySelector("input").focus();
    } catch (error) {
      setIsLoading2(false);
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteMember = async (memberInput) => {
    setIsLoading2(true);
    try {
      let data = await deleteMemberService(
        note.id,
        accessToken,
        memberInput.id
      );
      const updateMembers = members.filter(
        (member) => member.id !== memberInput.id
      );
      setIsLoading2(false);
      setMembers(updateMembers);
      toast.success(data.data.message);
    } catch (error) {
      setIsLoading2(false);
      console.log(error.response);
    }
  };

  let handleEditMember = (memberInput) => {
    setOpenEditMember(true);
    setEditMember(memberInput);
  };

  let owner =
    members.length > 0 && members.find((member) => member.role === "owner");
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        style={{ marginBottom: "100px" }}
      >
        <DialogTitle id="scroll-dialog-title">Add Member</DialogTitle>
        <DialogContent
          dividers={true}
          style={{
            height: "160px",
            position: "relative",
          }}
        >
          {owner && (
            <Stack
              key={owner.id}
              direction="row"
              spacing={2}
              style={{ marginTop: "12px" }}
            >
              <Avatar alt={owner.fullName} src="/static/images/avatar/2.jpg" />
              <Box>
                <Typography>
                  {owner.fullName} ({owner.role})
                </Typography>
                <Typography style={{ width: "360px" }}>
                  {owner.email}
                </Typography>
              </Box>
            </Stack>
          )}
          {members.length > 0 &&
            members.map(
              (member) =>
                member.role !== "owner" && (
                  <Stack
                    key={member.id}
                    direction="row"
                    spacing={2}
                    style={{ marginTop: "12px" }}
                  >
                    <Avatar
                      alt={member.fullName}
                      src="/static/images/avatar/2.jpg"
                    />
                    <Box>
                      <Typography>
                        {member.fullName} ({member.role})
                      </Typography>
                      <Typography style={{ width: "360px" }}>
                        {member.email}
                        <span>
                          <IconButton
                            style={{ marginLeft: "16px" }}
                            aria-label="edit"
                            size="small"
                            onClick={() => {
                              handleEditMember(member);
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                        <span>
                          <IconButton
                            style={{ marginLeft: "4px" }}
                            aria-label="delete"
                            size="small"
                            onClick={() => {
                              handleDeleteMember(member);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Typography>
                    </Box>
                  </Stack>
                )
            )}
          <Stack direction="row" spacing={2} style={{ marginTop: "12px" }}>
            <Avatar alt="By Sharp" src="/static/images/avatar/2.jpg" />
            <Box>
              <Input
                ref={divInputRef}
                placeholder="A person or email u will share with"
                type="text"
                style={{ width: "360px" }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
          </Stack>
        </DialogContent>
        <div style={{ height: "50px" }}>
          <LoadingButton
            color="secondary"
            onClick={handleAddMember}
            endIcon={<SendIcon />}
            loading={isLoading2}
            loadingPosition="end"
            variant="contained"
            style={{
              position: "absolute",
              right: 25,
              bottom: 5,
            }}
          >
            <span>Send</span>
          </LoadingButton>
        </div>
      </Dialog>
      {openEditMember && editMember && (
        <EditMember
          open={openEditMember}
          handleCloseFromParent={setOpenEditMember}
          member={editMember}
          note={note}
          members={members}
          setMembers={setMembers}
        />
      )}
    </>
  );
};

export default AddMember;

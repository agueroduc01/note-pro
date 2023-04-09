import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { red } from "@mui/material/colors";
import { useContext, useEffect, useState } from "react";
import { detailService } from "../../../services/user";
import { DataContext } from "../../../context/DataProvider";
import ChangeInfo from "./ChangeInfo";
import ChangePassword from "./ChangePassword";

const CardInfo = () => {
  const { accessToken } = useContext(DataContext);
  const [detailUser, setDetailUser] = useState({});
  const [openChangeInfo, setOpenChangeInfo] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    const getDetailUser = async () => {
      try {
        let data = await detailService(accessToken);
        setDetailUser(data.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getDetailUser();

    return () => {
      setDetailUser({});
    };
  }, [accessToken]);

  const handleCloseChangeInfo = () => {
    setOpenChangeInfo(false);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  const handleLogOut = async () => {};

  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {detailUser &&
                (detailUser.fullName
                  ? detailUser.fullName.substring(0, 1)
                  : " ")}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={detailUser.fullName}
          subheader={detailUser.phoneNumber}
        />
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
          <Button color="error" size="large" onClick={handleLogOut}>
            Log Out
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
    </>
  );
};

export default CardInfo;

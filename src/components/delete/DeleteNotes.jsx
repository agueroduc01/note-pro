import { useContext } from "react";

import { Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import { DataContext } from "../../context/DataProvider";
import Loading2 from "../loading/Loading2";
import Loading3 from "../loading/Loading3";
//components
import DeleteNote from "./DeleteNote";
import SwipeDrawer from "../SwipeDrawer";
import { useSelector } from "react-redux";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const DeleteNotes = () => {
  const { deleteNotes, searchText, isLoading, isLoading2 } =
    useContext(DataContext);
  const accessToken = useSelector((state) => state.user.login.accessToken);

  return (
    <>
      <SwipeDrawer />
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box sx={{ p: 3, width: "100%" }}>
          <DrawerHeader />
          <Grid container>
            {accessToken &&
              deleteNotes
                .filter((note) => {
                  if (searchText === "") {
                    return note;
                  } else if (
                    note.title.toLowerCase().includes(searchText.toLowerCase())
                  ) {
                    return note;
                  }
                  return false;
                })
                .map((deleteNote) => (
                  <Grid item key={deleteNote.id}>
                    <DeleteNote deleteNote={deleteNote} />
                  </Grid>
                ))}
          </Grid>
        </Box>
      </Box>
      {isLoading && <Loading2 />}
      {isLoading2 && <Loading3 />}
    </>
  );
};

export default DeleteNotes;

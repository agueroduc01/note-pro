import { useContext } from "react";

import { Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import { DataContext } from "../../context/DataProvider";

//components
import Archive from "./Archive";
import SwipeDrawer from "../SwipeDrawer";
import { useSelector } from "react-redux";
import Loading2 from "../loading/Loading2";
import Loading3 from "../loading/Loading3";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Archives = () => {
  const { archiveNotes, isLoading, isLoading2, searchText } =
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
              archiveNotes
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
                .map((archive) => (
                  <Grid item key={archive.id}>
                    <Archive archive={archive} />
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

export default Archives;

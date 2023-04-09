import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";

//components
import Notes from "./notes/Notes";
import Archives from "./archives/Archives";
import DeleteNotes from "./delete/DeleteNotes";
import Login from "./user/Login";
import { useContext } from "react";
import { DataContext } from "../context/DataProvider";

const Home = () => {
  const { accessToken } = useContext(DataContext);
  return (
    <Box style={{ display: "flex", width: "100%" }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={accessToken ? <Notes /> : <Navigate to="/login" />}
          />
          <Route path="/archive" element={<Archives />} />
          <Route path="/delete" element={<DeleteNotes />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover
        pauseOnFocusLoss
        closeOnClick
        draggable
        newestOnTop={false}
        rtl={false}
      />
    </Box>
  );
};

export default Home;

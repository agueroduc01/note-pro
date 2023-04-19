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
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useContext, useEffect } from "react";
import { DataContext } from "../context/DataProvider";
import { createAxios } from "../utils/createInstance";
import { loginSuccess } from "../redux/authSlice";
import { getNotesService } from "../services/note";

const Home = () => {
  const { setIsLoading, setNotes, setAcrchiveNotes, setDeleteNotes } =
    useContext(DataContext);
  const accessToken = useSelector((state) => state.user.login.accessToken);

  const dispatch = useDispatch();
  let axiosJWT = createAxios(accessToken, dispatch, loginSuccess);

  useEffect(() => {
    const getNotes = async () => {
      setIsLoading(true);
      try {
        let data = await getNotesService(accessToken, axiosJWT);
        setIsLoading(false);
        if (data) {
          const allNotes = data.data.data.filter(
            (note) => !note.isRemoved && !note.isArchived
          );
          setNotes(allNotes);
          toast.success(data.data.message);
          const archivedNotes = data.data.data.filter(
            (note) => note.isArchived
          );
          setAcrchiveNotes(archivedNotes);
          const deletedNotes = data.data.data.filter((note) => note.isRemoved);
          setDeleteNotes(deletedNotes);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getNotes();
    return () => {
      console.log("UNMOUNTED get notes");
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Box style={{ display: "flex", width: "100%" }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={accessToken ? <Notes /> : <Navigate to="/login" />}
          />
          <Route
            path="/archive"
            element={accessToken ? <Archives /> : <Navigate to="/login" />}
          />
          <Route
            path="/delete"
            element={accessToken ? <DeleteNotes /> : <Navigate to="/login" />}
          />
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

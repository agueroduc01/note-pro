import { useContext, useEffect } from "react";

import { Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { DataContext } from "../../context/DataProvider";
import { reorder } from "../../utils/common-utils";

//components
import Form from "./Form";
import Note from "./Note";
import EmptyNotes from "./EmptyNotes";
import SwipeDrawer from "../SwipeDrawer";
import CardInfo from "../user/UserInfoHome/CardInfo";

// Service
import { getNotesService } from "../../services/note";
import { toast } from "react-toastify";
import Loading2 from "../loading/Loading2";
import Loading3 from "../loading/Loading3";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createAxios } from "../../utils/createInstance";
import { loginSuccess } from "../../redux/authSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Notes = () => {
  const { notes, setNotes, isLoading, setIsLoading, isLoading2, searchText } =
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
          setNotes(data.data.data);
          toast.success(data.data.message);
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
  }, [accessToken, setNotes, setIsLoading]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = reorder(notes, result.source.index, result.destination.index);
    setNotes(items);
  };
  console.log("notesPinnedFromGetNotes", notes);
  return (
    <>
      <SwipeDrawer />
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box sx={{ p: 3, width: "100%" }}>
          <DrawerHeader />
          <Form />
          {accessToken &&
            notes.filter((note) => note.isPin === true).length > 0 && (
              <>
                {notes
                  .filter((note) => note.isPin === true)
                  .filter((note) =>
                    note.title.toLowerCase().includes(searchText.toLowerCase())
                  ).length > 0 && <h5>Được ghim</h5>}
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <Grid
                        container
                        style={{ marginTop: 16 }}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {notes
                          .filter((note) => note.isPin === true)
                          .filter((note) => {
                            if (searchText === "") {
                              return note;
                            } else if (
                              note.title
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                            ) {
                              return note;
                            }
                            return false;
                          })
                          .map((note, index) => (
                            <Draggable
                              key={note.id}
                              draggableId={note.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <Grid
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  item
                                >
                                  <Note note={note} />
                                </Grid>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </Grid>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            )}

          {accessToken &&
            (notes.filter((note) => note.isPin === false).length > 0 ||
            notes.filter((note) => note.isPin === true).length > 0 ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <br />
                {notes.filter((note) => note.isPin === true).length > 0 &&
                  notes.filter((note) => note.isPin === false).length > 0 &&
                  notes
                    .filter((note) => note.isPin === false)
                    .filter((note) =>
                      note.title
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    ).length > 0 && <h5>Khác</h5>}
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <Grid
                      container
                      style={{ marginTop: 16 }}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {notes
                        .filter((note) => note.isPin === false)
                        .filter((note) => {
                          if (searchText === "") {
                            return note;
                          } else if (
                            note.title
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                          ) {
                            return note;
                          }
                          return false;
                        })
                        .map((note, index) => (
                          // !note.isPin &&
                          <Draggable
                            key={note.id}
                            draggableId={note.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Grid
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                item
                              >
                                <Note note={note} />
                              </Grid>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Grid>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <EmptyNotes />
            ))}
        </Box>
        {accessToken && (
          <Box sx={{ p: 2, width: "25%" }}>
            <DrawerHeader />
            <CardInfo />
          </Box>
        )}
      </Box>
      {isLoading && <Loading2 />}
      {isLoading2 && <Loading3 />}
    </>
  );
};

export default Notes;

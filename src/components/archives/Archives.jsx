import { useContext, useEffect } from 'react';

import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import { DataContext } from '../../context/DataProvider';

//components
import Archive from './Archive';
import SwipeDrawer from '../SwipeDrawer';
import { useSelector } from 'react-redux';
import Loading2 from '../loading/Loading2';
import Loading3 from '../loading/Loading3';
import { useDispatch } from 'react-redux';
import { createAxios } from '../../utils/createInstance';
import { loginSuccess } from '../../redux/authSlice';
import { getNotesService } from '../../services/note';
import { toast } from 'react-toastify';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Archives = () => {
  const {
    archiveNotes,
    isLoading,
    isLoading2,
    searchText,
    setIsLoading,
    setAcrchiveNotes,
  } = useContext(DataContext);
  const accessToken = useSelector((state) => state.user.login.accessToken);

  const dispatch = useDispatch();
  let axiosJWT = createAxios(accessToken, dispatch, loginSuccess);

  useEffect(() => {
    let ignore = false;

    const getNotes = async () => {
      setIsLoading(true);
      try {
        let data = await getNotesService(accessToken, axiosJWT);
        setIsLoading(false);
        if (!ignore) {
          if (data) {
            toast.success('Got archive notes');
            const archivedNotes = data.data.data.filter(
              (note) => note.isArchived
            );
            setAcrchiveNotes(archivedNotes);
            // const deletedNotes = data.data.data.filter(
            //   (note) => note.isRemoved
            // );
            // setDeleteNotes(deletedNotes);
          }
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    getNotes();

    return () => {
      ignore = true;
      console.log('UNMOUNTED get notes');
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <SwipeDrawer />
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Box sx={{ p: 3, width: '100%' }}>
          <DrawerHeader />
          <Grid container>
            {accessToken &&
              archiveNotes
                .filter((note) => {
                  if (searchText === '') {
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

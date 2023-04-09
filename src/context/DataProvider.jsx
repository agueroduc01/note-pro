import { createContext, useState } from "react";

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [archiveNotes, setAcrchiveNotes] = useState([]);
  const [deleteNotes, setDeleteNotes] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <DataContext.Provider
      value={{
        notes,
        setNotes,
        archiveNotes,
        setAcrchiveNotes,
        deleteNotes,
        setDeleteNotes,
        accessToken,
        setAccessToken,
        isLoading,
        setIsLoading,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;

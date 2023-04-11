import { createContext, useState } from "react";

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [archiveNotes, setAcrchiveNotes] = useState([]);
  const [deleteNotes, setDeleteNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
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
        isLoading,
        setIsLoading,
        isLoading2,
        setIsLoading2,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;

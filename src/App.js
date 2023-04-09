//components
import Home from "./components/Home";
import DataProvider from "./context/DataProvider";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <DataProvider>
      <Home />
    </DataProvider>
  );
}

export default App;

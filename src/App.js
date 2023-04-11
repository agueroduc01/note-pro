//components
import Home from "./components/Home";
import { default as DataProviderContext } from "./context/DataProvider";
import "react-toastify/dist/ReactToastify.css";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <DataProviderContext>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Home />
        </PersistGate>
      </ReduxProvider>
    </DataProviderContext>
  );
}

export default App;

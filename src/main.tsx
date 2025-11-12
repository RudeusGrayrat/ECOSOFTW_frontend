import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PrimeReactProvider } from "primereact/api";
import { StrictMode } from "react";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";

import "primereact/resources/themes/saga-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <PrimeReactProvider>
            <App />
          </PrimeReactProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

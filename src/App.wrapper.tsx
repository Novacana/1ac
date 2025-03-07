
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LanguageProvider } from "./contexts/LanguageContext";

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default AppWrapper;

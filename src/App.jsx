import Header from "./components/Header/Header.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet } from "react-router-dom";

export const config = {
  endpoint: `http://localhost:8082/api`,
  authorizaiton :"perseverance"
};

function App() {
 
  return (
    <>
      <CssBaseline />
      <Header/>
      <Outlet/>
    </>
  )
  
}

export default App

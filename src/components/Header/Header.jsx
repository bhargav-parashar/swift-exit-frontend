import React, { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { config } from "../../App.jsx";
import { useSnackbar } from "notistack";
import IsLoggedInContext from "../Context/IsLoggedInContext.js";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Header = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { isLoggedIn, setIsLoggedIn, setIsLogoutClicked  } = useContext(IsLoggedInContext);

  useEffect(()=>{
    //make a request to server, with credentials. If token is verified, navigate to employee page
    //if token is not verified,do nothing
     console.log('Header effect Rendered', new Date());
      const checkStatus = async () =>{
      const URL = `${config.endpoint}/auth/loginstatus`;
      
      try{
        
        const res = await axios.post(URL, {}, {withCredentials : true} );
        if(res.status === 200){
          localStorage.setItem("userName",JSON.stringify(res.data.userName) );
          
          if(res.data.role === 'admin'){
            navigate("/hr-home-page")
          }else{
          navigate("/employee-home-page")
          }
        }else{
          localStorage.setItem("isLoggedIn", JSON.stringify(false));
          setIsLoggedIn(false);
          localStorage.removeItem("userName");
        }
        
      }catch(err){
        if(err.status === 403){
          localStorage.setItem("isLoggedIn", JSON.stringify(false));
          setIsLoggedIn(false);
          localStorage.removeItem("userName");
          navigate("/");
          enqueueSnackbar("Previous session timed out", { variant: "warning" });
        }

        console.log(err);
      }

    };
    checkStatus()
},[]); 

  const handleLogout = async () => {
    try {
      setIsLogoutClicked(true);
      const URL = `${config.endpoint}/auth/logout`;
      const res = await axios.post(URL, {}, { withCredentials: true }) ;
      localStorage.setItem("isLoggedIn", JSON.stringify(false));
      setIsLoggedIn(false);
      localStorage.removeItem("userName");
      enqueueSnackbar("Logged out successfully", { variant: "success" });
      navigate("/");
    } catch (err) {
      enqueueSnackbar(`Something went wrong - ${err}`, { variant: "warning" });
      console.log(err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, zIndex: 10, position:"relative" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {
              <Link to={
                !isLoggedIn ? "/" : JSON.parse(localStorage.getItem("userName")) === "admin" ? "/hr-home-page" :  "/employee-home-page" 
              } 
              style={{ color: "white", textDecoration: "none" }}>
                SwiftExit
              </Link>
            }
          </Typography>

          {isLoggedIn && (
            <Stack direction="row" spacing={2} alignItems="center">
              <AccountCircle />
              <Typography>{ JSON.parse(localStorage.getItem("userName")) || ""}</Typography>

              <Link to="/" style={{ color: "white" }}>
                <Button onClick={() => handleLogout()} color="inherit">
                  Logout
                </Button>
              </Link>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;

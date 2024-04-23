import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { ArrowBack } from "@material-ui/icons";

export default function ButtonAppBar({ pageTitle }) {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
    navigate("/");
  };

  const handleBackClick = () => {
    navigate("/dash");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {pageTitle ? (
            <>
              <IconButton onClick={handleBackClick}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {pageTitle}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {pageTitle}
              </Typography>
            </>
          )}

          {user && (
            <>
              <Typography>{user.email}</Typography>
              <Button color="inherit" onClick={handleClick}>
                Logout
              </Button>
            </>
          )}
          {!user && (
            <>
              <Button color="inherit" component={RouterLink} to="/log-in">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/sign-up">
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

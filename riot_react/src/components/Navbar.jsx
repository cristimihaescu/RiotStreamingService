import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from "./Searchbox";
import { getLogout } from "../util/ApiUtils";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import useCurrentUser from "../components/useCurrentUser";
import { makeStyles } from "@material-ui/core/styles";
import { WidthNormalTwoTone } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  menu: {
    backgroundColor: "black !important",
    color: "white !important",
    marginTop: "45px",
    marginLeft: "1px",
    borderRadius: "25% 0 !important",
  },
}));

const Navbar = (props) => {
  const { showSearchBox = true } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isLoggedIn = useCurrentUser();
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/Profile");
    window.location.reload();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    getLogout();
    localStorage.removeItem("from");
    navigate("/home");
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-around p-3 z-[100] w-full absolute">
      <Link to="/">
        <h1 className="text-purple-600 hover:text-pink-500 font-sans font-semibold text-3xl">
          RIOT STREAMING SERVICE
        </h1>
      </Link>
      {/* <Link to="/home">
        <h1 className="text-purple-600 hover:text-pink-500 font-sans font-semibold text-lg">
          HOME
        </h1>
      </Link> */}
      {showSearchBox && (
        <div>
          <SearchBox handleSearch={props.handleSearch} />
        </div>
      )}

      <div>
        {isLoggedIn ? (
          <Toolbar>
            {isLoggedIn && (
              <div className="rounded-full text-black ml-7 mb-0 mt-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 px-1.5 py-1.5 text-center">
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  classes={{
                    paper: classes.menu,
                  }}
                >
                  <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        ) : (
          <>
            <Link to="/auth/login">
              <button
                onClick={() => this.props.history.push("/auth/login")}
                className="text-white hover:text-pink-500 font-sans font-semibold pr-4"
              >
                Sign In
              </button>
            </Link>
            <Link to="/auth/register">
              <button className="text-black font-sans bg-gradient-to-r from-purple-600 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-semibold rounded-lg text-sm px-5 py-2.5 text-center">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default Navbar;

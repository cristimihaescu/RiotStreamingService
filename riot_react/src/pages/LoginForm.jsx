import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { getCurrentUser, getUserId, login } from "../util/ApiUtils";
import { ACCESS_TOKEN } from "../constants";
import { notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  textField: {
    color: "black!important",
  },
}));

export default function LoginForm() {
  const classes = useStyles();
  const [usernameOrEmail, setUserName] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    login({ usernameOrEmail, password })
      .then((response) => {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        getUserId(usernameOrEmail).then((data) =>
          localStorage.setItem("userId", data.id)
        );
        getCurrentUser();
        if (localStorage.getItem("from")) {
          navigate(localStorage.getItem("from"));
          localStorage.removeItem("from");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          notification.error({
            description:
              "Your Username or Password is incorrect. Please try again!",
          });
        } else {
          notification.error({
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        }
      });
  };

  return (
    <div className="">
      <Navbar showSearchBox={false} />
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-purple-900 to-pink-500">
        <form
          className="font-sans font-semibold"
          noValidate
          onSubmit={handleSubmit}
        >
          <TextField
            className="bg-opacity-25"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="usernameOrEmail"
            name="usernameOrEmail"
            label="Email Address"
            onChange={(e) => setUserName(e.target.value)}
            InputLabelProps={{ className: classes.textField }}
          />
          <TextField
            variant="outlined"
            className="bg-opacity-25"
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            InputLabelProps={{ className: classes.textField }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full"
            style={{
              backgroundColor: "#9932CC",
              color: "white",
              transition: "background-color 0.2s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#ec4899")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#9932CC")
            }
          >
            Sign in
          </Button>
          <p style={{ color: "black", textAlign: "center", marginTop: "1rem" }}>
            Don't have an account? <Link to="/auth/register">Register!</Link>
          </p>
        </form>
      </div>
      <Footer></Footer>
    </div>
  );
}

import React, { useState } from "react";
import {
  signup,
  checkUsernameAvailability,
  checkEmailAvailability,
} from "../util/ApiUtils";
import { Link } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "../constants";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const FormItem = Form.Item;
const current = new Date().toISOString().split("T")[0];

const Signup = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    name: { value: "", validateStatus: "", errorMsg: null },
    username: { value: "", validateStatus: "", errorMsg: null },
    userDateOfBirth: { value: "", validateStatus: "", errorMsg: null },
    email: { value: "", validateStatus: "", errorMsg: null },
    password: { value: "", validateStatus: "", errorMsg: null },
  });

  const handleInputChange = (event, validationFun) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
    setState((prevState) => ({
      ...prevState,
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue),
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const signupRequest = {
      email: state.email.value,
      username: state.username.value,
      userDateOfBirth: state.userDateOfBirth.value,
      password: state.password.value,
    };
    signup(signupRequest)
      .then((response) => {
        notification.success({
          description:
            "Thank you! You're successfully registered. Please Login to continue!",
        });
        navigate("/auth/login");
      })
      .catch((error) => {
        notification.error({
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
      });
  };

  const isFormInvalid = () => {
    return !(
      state.name.validateStatus === "success" &&
      state.username.validateStatus === "success" &&
      state.email.validateStatus === "success" &&
      state.password.validateStatus === "success"
    );
  };

  // Validation Functions

  const validateName = (name) => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  const validateEmail = (email) => {
    if (!email) {
      return {
        validateStatus: "error",
        errorMsg: "Email may not be empty",
      };
    }
    const EMAIL_REGEX = RegExp("[^@ ]+@[^@ ]+\\.[^@ ]+");
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: "error",
        errorMsg: "Email not valid",
      };
    }

    const domain = email.split("@")[1].split(".")[0];

    if (domain === "gmail" && !email.endsWith(".com")) {
      return {
        validateStatus: "error",
        errorMsg: "Gmail addresses must end in .com",
      };
    } else if (
      domain === "yahoo" &&
      !email.endsWith(".ru") &&
      !email.endsWith(".com")
    ) {
      return {
        validateStatus: "error",
        errorMsg: "Yahoo addresses must end in .ru or .com",
      };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`,
      };
    }

    return {
      validateStatus: "success",
      errorMsg: null,
    };
  };

  const validDateOfBirth = (dateOfBirth) => {
    if (dateOfBirth !== "mm/dd/yyyy") {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    } else {
      return {
        validateStatus: "error",
        errorMsg: "Please put your Date Of birth ",
      };
    }
  };

  const validateUsername = (username) => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  const validateUsernameAvailability = () => {
    const usernameValue = state.username.value;
    const usernameValidation = validateUsername(usernameValue);
    if (usernameValidation.validateStatus === "error") {
      setState((prevState) => ({
        ...prevState,
        username: {
          value: usernameValue,
          ...validateUsername(usernameValidation),
        },
      }));
    }
    setState((prevState) => ({
      ...prevState,
      username: {
        value: usernameValue,
        validateStatus: "validating",
        ...validateUsername(usernameValidation),
      },
    }));
    checkUsernameAvailability(usernameValue)
      .then((response) => {
        if (!response.AVAILABLE) {
          setState((prevState) => ({
            ...prevState,
            username: {
              value: usernameValue,
              validateStatus: "success",
              ...validateUsername(usernameValidation),
            },
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            username: {
              value: usernameValue,
              validateStatus: "error",
              ...validateUsername(usernameValidation),
            },
          }));
        }
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          username: {
            value: usernameValue,
            validateStatus: "success",
            errorMsg: null,
          },
        }));
      });
  };

  const validateEmailAvailability = () => {
    const emailValue = state.email.value;
    const emailValidation = validateEmail(emailValue);
    if (emailValidation.validateStatus === "error") {
      setState((prevState) => ({
        ...prevState,
        email: {
          value: emailValue,
          ...validateUsername(emailValidation),
        },
      }));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      email: {
        value: emailValue,
        validateStatus: "validating",
        errorMsg: null,
        ...validateUsername(emailValidation),
      },
    }));

    checkEmailAvailability(emailValue)
      .then((response) => {
        if (!response.AVAILABLE) {
          setState((prevState) => ({
            ...prevState,
            email: {
              value: emailValue,
              validateStatus: "success",
              errorMsg: null,
            },
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            email: {
              value: emailValue,
              validateStatus: "error",
              errorMsg: "This Email is already registered",
            },
          }));
        }
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          email: {
            value: emailValue,
            validateStatus: "success",
            errorMsg: "This Email is already registered",
          },
        }));
      });
  };

  const validatePassword = (password) => {
    const regexUpper = /[A-Z]/;
    const regexLower = /[a-z]/;
    const regexNumber = /[0-9]/;
    const regexSpecial = /[\W_]/; // matches any non-word character, e.g. !@#$%^&*

    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`,
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`,
      };
    } else if (!regexUpper.test(password)) {
      return {
        validateStatus: "error",
        errorMsg: "Password must contain at least one uppercase letter.",
      };
    } else if (!regexLower.test(password)) {
      return {
        validateStatus: "error",
        errorMsg: "Password must contain at least one lowercase letter.",
      };
    } else if (!regexNumber.test(password)) {
      return {
        validateStatus: "error",
        errorMsg: "Password must contain at least one number.",
      };
    } else if (!regexSpecial.test(password)) {
      return {
        validateStatus: "error",
        errorMsg: "Password must contain at least one special character.",
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  return (
    <div className="">
      <Navbar showSearchBox={false} />
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-purple-900 to-pink-500">
        <div className="p-8 rounded-3xl shadow-md w-96 bg-gray-900 bg-opacity-25">
          <form onSubmit={handleSubmit}>
            <FormItem
              label={<span className="text-purple-500">Full Name</span>}
              validateStatus={state.name.validateStatus}
              help={state.name.errorMsg}
            >
              <Input
                size="large"
                name="name"
                autoComplete="off"
                placeholder="Full name"
                value={state.name.value}
                onChange={(event) => handleInputChange(event, validateName)}
              />
            </FormItem>
            <FormItem
              label={<span className="text-purple-500">Username</span>}
              hasFeedback
              validateStatus={state.username.validateStatus}
              help={state.username.errorMsg}
            >
              <Input
                size="large"
                name="username"
                autoComplete="off"
                placeholder="Username"
                value={state.username.value}
                onBlur={validateUsernameAvailability}
                onChange={(event) => handleInputChange(event, validateUsername)}
              />
            </FormItem>
            <FormItem
              label={<span className="text-purple-500">Date of Birth</span>}
              validateStatus={state.userDateOfBirth.validateStatus}
            >
              <Input
                type="date"
                placeholder="Enter BirthDate"
                value={state.userDateOfBirth.value}
                name="userDateOfBirth"
                max={current}
                onChange={(event) => handleInputChange(event, validDateOfBirth)}
              />
            </FormItem>
            <FormItem
              label={<span className="text-purple-500">Email</span>}
              hasFeedback
              validateStatus={state.email.validateStatus}
              help={state.email.errorMsg}
            >
              <Input
                size="large"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="Your email"
                value={state.email.value}
                onBlur={validateEmailAvailability}
                onChange={(event) => handleInputChange(event, validateEmail)}
              />
            </FormItem>
            <FormItem
              label={<span style={{ color: "#9932CC" }}>Password</span>}
              validateStatus={state.password.validateStatus}
              help={state.password.errorMsg}
            >
              <Input
                size="large"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="A password between 6 to 20 characters"
                value={state.password.value}
                onChange={(event) => handleInputChange(event, validatePassword)}
              />
            </FormItem>

            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="signup-form-button"
                disabled={isFormInvalid()}
                onSubmit={handleSubmit}
                style={{
                  backgroundColor: "#9932CC",
                  transition: "background-color 0.2s ease-in-out",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "purple")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#9932CC")
                }
              >
                Sign up
              </Button>
              <span style={{ color: "#9932CC" }}>
                <br></br>
                <br></br>
                Already registered?{" "}
                <Link
                  onClick={() => navigate("/auth/login")}
                  to="/auth/login"
                  style={{ color: "#9932CC" }}
                >
                  Login now!
                </Link>
              </span>
            </FormItem>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

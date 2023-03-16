import React, {Component} from "react";
import {
    signup,
    checkUsernameAvailability,
    checkEmailAvailability,
} from "../util/ApiUtils";
import {Link} from "react-router-dom";
import {Form, Input, Button, notification} from "antd";
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

const FormItem = Form.Item;
const current = new Date().toISOString().split("T")[0];

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: "",
            },
            username: {
                value: "",
            },
            userDateOfBirth: {
                value: "",
            },
            email: {
                value: "",
            },
            password: {
                value: "",
            },
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUsernameAvailability =
            this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;
        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue),
            },
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const signupRequest = {
            email: this.state.email.value,
            username: this.state.username.value,
            userDateOfBirth: this.state.userDateOfBirth.value,
            password: this.state.password.value,
        };
        signup(signupRequest)
            .then((response) => {
                notification.success({
                    description:
                        "Thank you! You're successfully registered. Please Login to continue!",
                });
            })
            .catch((error) => {
                notification.error({
                    description:
                        error.message || "Sorry! Something went wrong. Please try again!",
                });
            });
    }

    isFormInvalid() {
        return !(
            (
                this.state.username.validateStatus === "success" &&
                this.state.email.validateStatus === "success" &&
                this.state.password.validateStatus === "success"
            )
            // this.state.userDateOfBirth.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="">
                <Navbar showSearchBox={false}/>
                <div
                    className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-purple-900 to-pink-500">
                    <div className="bg-white p-8 rounded shadow-md w-96">
                        <form onSubmit={this.handleSubmit}>
                            <FormItem
                                label={<span className="text-purple-500">Full Name</span>}
                                validateStatus={this.state.name.validateStatus}
                                help={this.state.name.errorMsg}
                            >
                                <Input
                                    size="large"
                                    name="name"
                                    autoComplete="off"
                                    placeholder="Full name"
                                    value={this.state.name.value}
                                    onChange={(event) =>
                                        this.handleInputChange(event, this.validateName)
                                    }
                                />
                            </FormItem>
                            <FormItem
                                label={<span className="text-purple-500">Username</span>}
                                hasFeedback
                                validateStatus={this.state.username.validateStatus}
                                help={this.state.username.errorMsg}
                            >
                                <Input
                                    size="large"
                                    name="username"
                                    autoComplete="off"
                                    placeholder="Username"
                                    value={this.state.username.value}
                                    onBlur={this.validateUsernameAvailability}
                                    onChange={(event) =>
                                        this.handleInputChange(event, this.validateUsername)
                                    }
                                />
                            </FormItem>
                            <FormItem
                                label={<span className="text-purple-500">Date of Birth</span>}
                                validateStatus={this.state.userDateOfBirth.validateStatus}
                            >
                                <Input
                                    type="date"
                                    placeholder="Enter BirthDate"
                                    value={this.state.userDateOfBirth.value}
                                    name="userDateOfBirth"
                                    max={current}
                                    onChange={(event) =>
                                        this.handleInputChange(event, this.validDateOfBirth)
                                    }
                                />
                            </FormItem>
                            <FormItem
                                label={<span className="text-purple-500">Email</span>}
                                hasFeedback
                                validateStatus={this.state.email.validateStatus}
                                help={this.state.email.errorMsg}
                            >
                                <Input
                                    size="large"
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                    placeholder="Your email"
                                    value={this.state.email.value}
                                    onBlur={this.validateEmailAvailability}
                                    onChange={(event) =>
                                        this.handleInputChange(event, this.validateEmail)
                                    }
                                />
                            </FormItem>
                            <FormItem
                                label={<span style={{color: "#9932CC"}}>Password</span>}
                                validateStatus={this.state.password.validateStatus}
                                help={this.state.password.errorMsg}
                            >
                                <Input
                                    size="large"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    placeholder="A password between 6 to 20 characters"
                                    value={this.state.password.value}
                                    onChange={(event) =>
                                        this.handleInputChange(event, this.validatePassword)
                                    }
                                />
                            </FormItem>

                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className="signup-form-button"
                                    disabled={this.isFormInvalid()}
                                    onSubmit={this.handleSubmit}
                                    style={{
                                        backgroundColor: "#9932CC",
                                        transition: "background-color 0.2s ease-in-out",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor = "transparent")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor = "#9932CC")
                                    }
                                >
                                    Sign up
                                </Button>
                                <span style={{color: "#9932CC"}}>
                  Already registered?{" "}
                                    <Link
                                        onClick={() => this.props.history.push("/auth/login")}
                                        to="/auth/login"
                                        style={{color: "#9932CC"}}
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
    }

    // Validation Functions

    validateName = (name) => {
        if (name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: "error",
                errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`,
            };
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: "error",
                errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`,
            };
        } else {
            return {
                validateStatus: "success",
                errorMsg: null,
            };
        }
    };

    validateEmail = (email) => {
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

        const domain = email.split('@')[1].split('.')[0];

        if (domain === "gmail" && !email.endsWith(".com")) {
            return {
                validateStatus: "error",
                errorMsg: "Gmail addresses must end in .com",
            };
        } else if (domain === "yahoo" && !email.endsWith(".ru") && !email.endsWith(".com")) {
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
            validateStatus: null,
            errorMsg: null,
        };
    };


    validDateOfBirth = (dateOfBirth) => {
        if (dateOfBirth != "mm/dd/yyyy") {
            return {
                validateStatus: null,
                errorMsg: null,
            };
        } else {
            return {
                validateStatus: "error",
                errorMsg: "Please put your Date Of birth ",
            };
        }
    };

    validateUsername = (username) => {
        if (username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: "error",
                errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`,
            };
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: "error",
                errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`,
            };
        } else {
            return {
                validateStatus: null,
                errorMsg: null,
            };
        }
    };

    validateUsernameAvailability() {
        // First check for client side errors in username
        const usernameValue = this.state.username.value;
        const usernameValidation = this.validateUsername(usernameValue);

        if (usernameValidation.validateStatus === "error") {
            this.setState({
                username: {
                    value: usernameValue,
                    ...usernameValidation,
                },
            });
            return;
        }

        this.setState({
            username: {
                value: usernameValue,
                validateStatus: "validating",
                errorMsg: null,
            },
        });

        checkUsernameAvailability(usernameValue)
            .then((response) => {
                if (!response.AVAILABLE) {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: "success",
                            errorMsg: null,
                        },
                    });
                } else {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: "error",
                            errorMsg: "This username is already taken",
                        },
                    });
                }
            })
            .catch((error) => {
                // Marking validateStatus as success, Form will be recchecked at server
                this.setState({
                    username: {
                        value: usernameValue,
                        validateStatus: "success",
                        errorMsg: null,
                    },
                });
            });
    }

    validateEmailAvailability() {
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);
        if (emailValidation.validateStatus === "error") {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation,
                },
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: "validating",
                errorMsg: null,
            },
        });

        checkEmailAvailability(emailValue)
            .then((response) => {
                if (!response.AVAILABLE) {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: "success",
                            errorMsg: null,
                        },
                    });
                } else {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: "error",
                            errorMsg: "This Email is already registered",
                        },
                    });
                }
            })
            .catch((error) => {
                // Marking validateStatus as success, Form will be recchecked at server
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: "success",
                        errorMsg: null,
                    },
                });
            });
    }

    validatePassword = (password) => {
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
                validationStatus: "error",
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

}

export default Signup;

import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {useState} from "react";
import {changePassword, getFavoriteMovie, getUserId} from "../util/ApiUtils";
import {Carousel} from "antd";
import MovieCard from "../components/MovieCard";
import {
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
} from "../constants";
import {notification} from "antd";
import Navbar from "../components/Navbar";
import useCurrentUser from "../components/useCurrentUser";

const ProfilePage = () => {
    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState({});
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const isLoggedIn = useCurrentUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password validation
        const passwordValidation = validatePassword(newPassword);
        if (passwordValidation.validateStatus === "error") {
            notification.error({description: passwordValidation.errorMsg});
            return;
        }

        // Form submission validation
        if (!currentPassword) {
            notification.error({description: "Please enter your current password."});
            return;
        }
        if (!newPassword) {
            notification.error({description: "Please enter a new password."});
            return;
        }
        if (!confirmPassword) {
            notification.error({description: "Please confirm your new password."});
            return;
        }
        if (newPassword !== confirmPassword) {
            notification.error({description: "The new password and confirmation do not match."});
            return;
        }

        try {
            const response = await changePassword(currentPassword, newPassword);
            if (response.message === "Your password is updated") {
                notification.success({ description: "Your password is updated" });
            } else {
                notification.error({ description: "The password you entered doesn't match your current one." });
            }
        } catch (error) {
            console.log(error.message);
        }
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


    useEffect(() => {
        getUserId(localStorage.getItem("userId")).then((data) => setUser(data));
    }, []);


    useEffect(() => {
        getFavoriteMovie(localStorage.getItem("userId")).then((data) =>
            setMovies(data)
        );
    }, []);
    const handleInputChange = (event) => {
        const {name, value} = event.target;

        if (name === "newPassword") {
            const validationResult = validatePassword(value);
            setNewPassword(value);
            setNewPasswordError(validationResult.errorMsg);
        } else if (name === "confirmPassword") {
            setConfirmPassword(value);
            if (value !== newPassword) {
                setConfirmPasswordError("Passwords do not match.");
            } else {
                setConfirmPasswordError(null);
            }
        } else {
            setCurrentPassword(value);
        }
    };

  return (
    <div className="h-screen flex flex-col">
      <Navbar showSearchBox={false} />
      {isLoggedIn && (
        <div className="bg-gradient-to-br from-purple-900 to-pink-500 min-h-screen bg-center bg-fixed h-screen flex-col justify-center items-center text-center text-white bg-cover bg-no-repeat">
          <div className="">
            {Array(4)
              .fill()
              .map((_, index) => (
                <br key={index} />
              ))}
            <h1 className="text-4xl font-semibold font-sans mb-5">
              Hello, {user.username}
            </h1>
            <p className="mb-4">
              Username:
              <input
                type="text"
                value={user.username}
                className="bg-transparent text-white mx-2 "
                style={{ textAlign: "center" }}
              />
            </p>
            <p className="mb-4">
              Date of Birth:
              <input
                type="text"
                value={user.userDateOfBirth}
                className="bg-transparent text-white  "
                style={{ textAlign: "center" }}
              />
            </p>
            <p className="mb-4">
              Email:
              <input
                type="text"
                value={user.userEmail}
                className="bg-transparent text-white  "
                style={{ textAlign: "center" }}
              />
            </p>
          </div>
                          <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
                    <div className="mb-4">
                        <label htmlFor="currentPassword" className="block font-medium mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={handleInputChange}
                            className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        /></div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block font-medium mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            value={newPassword}
                            onChange={handleInputChange}
                            className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {newPasswordError && (
                            <div className="text-red-500 text-sm">{newPasswordError}</div>
                        )}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block font-medium mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleInputChange}
                            className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {confirmPasswordError && (
                            <div className="text-red-500 text-sm">{confirmPasswordError}</div>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Change Password
                        </button>
                    </div>

                </form>
          <div className="mt-20">
            <h2 className="text-3xl font-sans font-semibold mb-5">
              Your Watchlist
            </h2>
            <Carousel
              dots={false}
              infinite={movies.length > 2}
              autoplay
              speed={300}
              slidesToShow={3}
              slidesToScroll={1}
            >
              {movies.length > 0 ? (
                movies.map((e, i) => {
                  return (
                    <MovieCard
                      key={i}
                      id={e.id}
                      enName={e.english_title}
                      img={e.backdrop_path}
                      imbd={e.imdb}
                      object={e}
                      time={e.runtime + "min"}
                      year={new Date(e.release_date).getFullYear()}
                    />
                  );
                })
              ) : (
                <h4 className="text-white text-center p-20 font-bold flex-col items-center">
                  Your Watchlist is empty
                </h4>
              )}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};


export default ProfilePage;

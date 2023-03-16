import {ACCESS_TOKEN, API_BASE_URL} from "../constants";

export const API_KEY = "89aaee4ab1539e7be52da739bf27ab05";

const request = (options) => {
    const headers = new Headers({
        "Content-Type": "application/json",
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append(
            "Authorization",
            "Bearer " + localStorage.getItem(ACCESS_TOKEN)
        );
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);
    return fetch(options.url, options).then((response) =>
        response.json().then((json) => {
            if (!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: "POST",
        body: JSON.stringify(loginRequest),
    });
}

export function signup(signupRequest) {
    console.log(signupRequest);
    return request({
        url: API_BASE_URL + "/auth/register",
        method: "POST",
        body: JSON.stringify(signupRequest),
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: "GET",
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: "GET",
    });
}

export function getLogout() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem("userId");
    return request({
        url: API_BASE_URL + "/auth/logout",
        method: "GET",
    });
}

export function getMovieById(id) {
    return request({
        url: "http://localhost:8080/api/watch?movieId=" + id,
        method: "GET",
    });
}

export function changePassword(oldPassword, newPassword) {
    return request({
        url: API_BASE_URL + "/user/changePassword?oldPassword=" + oldPassword + "&&newPassword=" + newPassword,
        method: "POST"
    })
}

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/",
        method: "GET",
    });
}

export function getMovieGenre() {
    return request({
        url: API_BASE_URL + "/movieGenre",
        method: "GET",
    });
}

export function getMovieByGenre(genre) {
    return request({
        url: API_BASE_URL + "/movieByGenre?genreId=" + genre,
        method: "GET",
    });
}

export function getMovieByYearRelease(year) {
    return request({
        url: API_BASE_URL + "/movieByYearRelease?movieByYearRelease=" + year,
        method: "GET",
    });
}

export function getYear() {
    return request({
        url: API_BASE_URL + "/movie/year",
        method: "GET",
    });
}

export function addFavoriteMovie(userId, movieId) {
    return request({
        url: API_BASE_URL + "/favorites?userId=" + userId + "&movieId=" + movieId,
        method: "POST",
    });
}

export function removeFavoriteMovie(userId, movieId) {
    return request({
        url:
            API_BASE_URL +
            "/favorite/removeMovieId?movieId=" +
            movieId +
            "&userId=" +
            userId,
        method: "DELETE",
    });
}

export function getFavoriteMovie(userId) {
    return request({
        url: API_BASE_URL + "/favorites?userId=" + userId,
        method: "GET",
    });
}

export function getGenresNameByMovieId(movieId) {
  return request({
    url: API_BASE_URL + "/movieGenreById?movieId=" + movieId + "&limit=15",
    method: "GET",
  });
}


export function getUserId(username) {
    return request({
        url: API_BASE_URL + "/user?username=" + username,
        method: "GET",
    });
}

export function getUserProfile(username) {
    return request({
        url: "/users/" + username,
        method: "GET",
    });
}

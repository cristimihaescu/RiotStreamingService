package com.src.riot.controller;

import com.src.riot.model.Movie;
import com.src.riot.model.MovieGenre;
import com.src.riot.model.User;
import com.src.riot.payload.UserIdentityAvailability;
import com.src.riot.payload.UserSummary;
import com.src.riot.service.MovieGenreService;
import com.src.riot.service.MovieService;
import com.src.riot.service.UserService;
import com.src.riot.service.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    MovieService movieService;
    @Autowired
    MovieGenreService movieGenreService;
    @Autowired
    private PasswordEncoder passwordEncoder;


    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
        return userSummary;
    }

    @GetMapping("/movieGenre")
    public List<MovieGenre> movieGenreList() {
        return movieGenreService.movieGenreList();
    }

    @GetMapping("/movieByGenre")
    public Set<Movie> getMovieByGenre(@RequestParam(value = "genreId") Long genreId) {
        return movieGenreService.getMovieByGenreId(genreId);
    }

    @GetMapping("/movieByYearRelease")
    public List<Movie> getMovieByYear(@RequestParam(value = "movieByYearRelease") String id) {
        return movieService.getMoviesByYearRelease(id);
    }

    @GetMapping("/movie/year")
    public List<String> getYear() {
        return movieService.getYear();
    }

    @PostMapping("/favorites")
    public ResponseEntity<String> addFavoriteMovie(@RequestParam(value = "userId") Long userId, @RequestParam(value = "movieId") Long movieId) {
        Optional<Movie> movieOptional = movieService.findById(movieId);
        Movie movie = movieOptional.orElseThrow(() -> new RuntimeException("Movie not found with ID: " + movieId));
        Optional<User> userOptional = userService.findById(userId);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        if (!user.getFavorite_movie_id().contains(movie)) {
            user.getFavorite_movie_id().add(movie);

            User updatedUser = userService.save(user);

            return ResponseEntity.ok("Added favorite movie " + movieId + " to user " + updatedUser.getUsername());
        } else {
            return ResponseEntity.ok("Movie " + movieId + " is already a favorite of user " + user.getUsername());
        }
    }

    @GetMapping("/favorites")
    public List<Movie> getFavoriteMovie(@RequestParam(value = "userId") Long userId) {
        return userService.getFavoriteMovie(userId);
    }

    @GetMapping("/movieGenreById")
    public Set<String> getGenresNameByMovieId(@RequestParam(value = "movieId") Long movieId) {
        return movieService.findGenresByMovieId(movieId);
    }

    @DeleteMapping("/favorite/removeMovieId")
    public ResponseEntity<String> removeFavoriteMovieByUser(@RequestParam(value = "movieId") Long movieId, @RequestParam(value = "userId") Long userId) {
        Optional<Movie> movieOptional = movieService.findById(movieId);
        Movie movie = movieOptional.orElseThrow(() -> new RuntimeException("Movie not found with ID: " + movieId));
        Optional<User> userOptional = userService.findById(userId);
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        if (user.getFavorite_movie_id().contains(movie)) {
            user.getFavorite_movie_id().remove(movie);

            User updatedUser = userService.save(user);

            return ResponseEntity.ok("Deleted favorite movie " + movieId + " to user " + updatedUser.getUsername());
        } else {
            return ResponseEntity.ok("Movie " + movieId + " is not favorite of user " + user.getUsername());
        }
    }


    @GetMapping("/watch")
    public Optional<Movie> getMovieById(@RequestParam(value = "movieId") Long movieId) {
        return movieService.getMovieById(movieId);
    }

    @PostMapping("/watch")
    public Optional<Movie> getMovieId(@RequestParam(value = "movieId") Long movieId) {
        return movieService.getMovieById(movieId);
    }

    @GetMapping("/user/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userService.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/user/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userService.existByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }


    @GetMapping("/user")
    public User getUserProfile(@RequestParam(value = "username") String username, @AuthenticationPrincipal UserPrincipal currentUser) {
        User user = new User(currentUser.getId(), currentUser.getUsername(), currentUser.getUserDateOfBirth(), currentUser.getEmail());
        return user;
    }


    @PostMapping("/user/changePassword")
    public ResponseEntity<Map<String, String>> updateUserPassword(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                  @RequestParam(value = "oldPassword") String oldPassword,
                                                                  @RequestParam(value = "newPassword") String newPassword) {
        User user = new User(currentUser.getId(), currentUser.getUsername(), currentUser.getUserDateOfBirth(), currentUser.getEmail(), currentUser.getPassword());

        if (passwordEncoder.matches(oldPassword, user.getUserPassword())) {
            user.setUserPassword(passwordEncoder.encode(newPassword));
            userService.save(user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Your password is updated");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "The password you entered doesn't match your current one.");
            return ResponseEntity.ok(response);
        }
    }


}
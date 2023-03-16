import MovieCard from "../components/MovieCard";
import StyledMenu from "../components/StyleMenu";
import React, { useCallback, useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { Autorenew } from "@mui/icons-material";
import { Container } from "react-bootstrap";
import {
  getMovieByGenre,
  getMovieByYearRelease,
  getMovieGenre,
  getYear,
} from "../util/ApiUtils";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "../components/Footer";
const useStyles = makeStyles((theme) => ({
  genreMenu: {
    backgroundColor: "black !important",
    color: "white !important",
    marginTop: "45px",
    marginLeft: "1px",
    overflow: "hidden! important ",
  },
  refresh: {
    margin: "auto",
  },
  spin: {
    margin: "auto",
    animation: "$spin 1s 1",
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

function Home() {
  const [isFetching, setIsFetching] = useState(false);
  const [spin, setSpin] = useState(0);
  const classes = useStyles();
  const [isAtTop, changeGoToTop] = useState(false);
  const [searchedArray, setSearchedArray] = useState([false]);
  const [startIndex, changeStartIndex] = useState(0);
  const [isSearched, changeIsSearched] = useState("");
  const debounceTimeoutId = useRef(null);
  const [loading, setLoading] = useState(false);
  const [movieGenre, setMovieGenre] = useState([false]);
  const [movieYear, setMovieYear] = useState([false]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [anchorElMovieYear, setAnchorElMovieYear] = useState(null);
  const [anchorElMovieGenre, setAnchorElMovieGenre] = useState(null);
  const open = Boolean(anchorElMovieGenre);

  const movieGenreList = async () => {
    try {
      setLoading(true);
      const data = await getMovieGenre(startIndex);
      setLoading(false);
      setMovieGenre((movieGenre) => [...movieGenre, ...data]);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    movieGenreList();
    movieYearList();
  }, []);
  const movieYearList = async () => {
    getYear()
      .then((data) => {
        setMovieYear(data);
      })
      .then(function (response) {
        console.log(`Fetch complete. (Not aborted)`);
      })
      .catch(function (err) {
        console.error(` Err: ${err}`);
      });
  };
  const handleClick = (event) => {
    setAnchorElMovieGenre(event.currentTarget);
    setSelectedFilter("genre");
  };
  const handleClickYearButton = (event) => {
    setAnchorElMovieYear(event.currentTarget);
    setSelectedFilter("year");
  };
  const handleClose = async (item) => {
    setSearchedArray([]);
    const response = await getMovieByGenre(item);
    let filteredArray = [];
    for (let obj of response) {
      filteredArray.push(obj);
    }
    setSearchedArray(filteredArray);
    setAnchorElMovieGenre(null);
    setAnchorElMovieYear(null);
  };
  const handleCloseYear = async (item) => {
    setSearchedArray([]);
    const response = await getMovieByYearRelease(item);
    let filteredArray = [];
    for (let obj of response) {
      filteredArray.push(obj);
    }
    setSearchedArray(filteredArray);
    setAnchorElMovieYear(null);
    setAnchorElMovieGenre(null);
  };
  const movieList = async (searchText) => {
    try {
      console.log(searchText);
      let response;
      setLoading(true);
      const endpoint = searchText
        ? `api?english_title=${searchText}`
        : `api?startIndex=${startIndex}`;
      response = await fetch(endpoint);
      setLoading(false);
      if (!response.ok) {
        throw new Error(
          `Error: Failed to load resource: the server responded with a status of ${response.status}`
        );
      }
      const data = await response.json();
      if (data.length === 20) {
        changeStartIndex(startIndex + 20);
      }
      setSearchedArray(
        searchText
          ? data
          : searchedArray.concat(data.slice(startIndex, startIndex + 20))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    movieList();
  }, [startIndex]);
  const handleSearch = useCallback(
    async (text) => {
      if (text.length >= 2) {
        if (debounceTimeoutId.current) {
          clearTimeout(debounceTimeoutId.current);
        }

        debounceTimeoutId.current = setTimeout(async () => {
          changeIsSearched(text);
          try {
            const response = await fetch(`api?title=${text}`);
            if (!response.ok) {
              throw new Error(
                `Error: Failed to load resource: the server responded with a status of ${response.status}`
              );
            }
            const data = await response.json();
            let filteredArray = data.filter(function (obj) {
              return obj.english_title
                .toLowerCase()
                .startsWith(text.toLowerCase()); // Use startsWith instead of includes
            });
            filteredArray.sort(function (a, b) {
              // Sort the array based on the position of the search string in the title
              const indexA = a.english_title
                .toLowerCase()
                .indexOf(text.toLowerCase());
              const indexB = b.english_title
                .toLowerCase()
                .indexOf(text.toLowerCase());
              return indexA - indexB;
            });
            let otherMoviesArray = data.filter(function (obj) {
              return (
                obj.english_title.toLowerCase().includes(text.toLowerCase()) &&
                !filteredArray.includes(obj)
              );
            });
            let finalArray = filteredArray.concat(otherMoviesArray);
            setSearchedArray(finalArray);
          } catch (err) {
            console.error(`Error: ${err}`);
          }
        }, 500);
      } else if (text.length === 0) {
        changeIsSearched("");
        setSearchedArray([]);
        movieList();
      }
    },
    [changeIsSearched, movieList]
  );

  const handleScroll = useCallback(() => {
    if (isSearched !== "" || isFetching) {
      return;
    }
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      changeStartIndex((startIndex) => startIndex + 20);
    }
  }, [isSearched, isFetching]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleScroll = () => {
      changeGoToTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const refreshCanvas = () => {
    setSpin(true);
    setTimeout(() => {
      setSpin(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 to-pink-500">
      <div>
        <Navbar handleSearch={handleSearch} />
        <br></br>
        <br></br>
        <br></br>
      </div>
      <div className="shadow-sm max-w-sm mx-auto sm:max-w-7xl bg-gray-900 relative bg-opacity-10 rounded-3xl mt-5">
        <div>
          <div className="mt-14 right-8 absolute text-black bg-gradient-to-r from-purple-600 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 rounded-lg px-3 py-1 text-center mr-3">
            <Autorenew
              className={spin ? classes.spin : classes.refresh}
              onClick={refreshCanvas}
              spin={spin}
            />
          </div>
          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
            class="text-black font-sans ml-7 mb-0 mt-14 bg-gradient-to-r from-purple-600 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-semibold rounded-lg text-sm px-5 py-2.5 text-center mr-2"
          >
            GENRE
          </Button>
          <StyledMenu
            id="simple-menu"
            anchorEl={anchorElMovieGenre}
            keepMounted
            open={Boolean(anchorElMovieGenre)}
            onClose={() => setAnchorElMovieGenre(null)}
          >
            {movieGenre.map((option, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  handleClose(option.id);
                }}
              >
                {option.name}
              </MenuItem>
            ))}
          </StyledMenu>
          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClickYearButton}
            endIcon={<KeyboardArrowDownIcon />}
            class="text-black font-sans ml-3 mb-0 mt-10 bg-gradient-to-r from-purple-600 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-semibold rounded-lg text-sm px-6 py-2.5 text-center mr-2"
          >
            YEAR
          </Button>
          <StyledMenu
            id="simple-menu"
            anchorEl={anchorElMovieYear}
            keepMounted
            open={Boolean(anchorElMovieYear)}
            onClose={() => setAnchorElMovieYear(null)}
          >
            {movieYear.map((option, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  handleCloseYear(option);
                }}
              >
                {option}
              </MenuItem>
            ))}
          </StyledMenu>
        </div>
        <div
          className={`md:grid md:grid-cols-3 md:gap-5 ${
            searchedArray.length ? "" : "hidden"
          }`}
        >
          {searchedArray ? (
            searchedArray.map((e, i) => {
              return (
                <MovieCard
                  key={i}
                  id={e.id}
                  enName={e.english_title}
                  img={e.backdrop_path}
                  imbd={e.imdb}
                  object={e}
                  time={Math.floor(e.runtime / 60) + "h" + (e.runtime % 60)}
                  year={new Date(e.release_date).getFullYear()}
                />
              );
            })
          ) : (
            <h4 className="text-white text-center p-20 font-bold flex-col items-center">
              No results found
            </h4>
          )}
        </div>
        <div id="searched" className="px-6 py-4">
          {isSearched !== "" ? (
            <h4 className="text-white text-center m-0 font-medium p-5 flex-col items-center">
              You've searched: {isSearched}
            </h4>
          ) : (
            ""
          )}
          <button
            className={`text-black font-sans bg-gradient-to-r from-purple-600 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-semibold rounded-lg text-sm px-2.5 py-2.5 text-center ${
              isAtTop ? "" : "hidden"
            }`}
            style={{ position: "fixed", right: "10px", top: "10px" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to Top
          </button>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
export default Home;

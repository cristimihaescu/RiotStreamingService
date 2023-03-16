import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getGenresNameByMovieId, getMovieById } from "../util/ApiUtils";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import TorServer from "../components/TorServer";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SimilarMovies from "../components/SimilarMovies";
import useCurrentUser from "../components/useCurrentUser";

const Watch = () => {
  const [movieGenre, setMovieGenre] = useState([]);
  const [movie, setMovie] = useState(null);
  const { id } = useParams();
  const isLoggedIn = useCurrentUser();

  useEffect(() => {
    const fetchMovieGenre = async () => {
      try {
        const data = await getGenresNameByMovieId(id);
        setMovieGenre(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieGenre();

    getMovieById(id)
      .then((response) => {
        setMovie(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col  bg-gradient-to-br from-purple-900 to-pink-500">
      <Navbar showSearchBox={false} />
      {isLoggedIn && (
        <div className="flex flex-col flex-grow max-w-7xl mx-auto">
          <div className="h-screen relative flex-grow">
            <div
              className="absolute inset-0 bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://image.tmdb.org/t/p/w500${movie?.backdrop_path}')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black opacity-75" />
              <div className="absolute inset-0 p-5 lg:p-10 flex flex-col justify-between">
                <div className="flex justify-start"></div>
                <div className="text-white text-center">
                  <h2 className="text-3xl lg:text-4xl font-sans font-semibold mb-5">
                    {movie?.english_title}
                  </h2>
                  <div className="flex flex-col lg:flex-row justify-center">
                    <div className="font-sans font-semibold mr-0 lg:mr-4 mb-4 lg:mb-0">
                      <h2>
                        IMDb:{" "}
                        <span className="text-yellow-400 shadow-lg font-bold">
                          {movie?.imdb}
                          <FontAwesomeIcon icon={faStar} />
                        </span>
                      </h2>
                      <h2 className="hidden lg:block">
                        Release: {movie?.release_date}
                      </h2>
                      <h2>
                        Duration: {Math.floor(movie?.runtime / 60)}h
                        {movie?.runtime % 60}m
                      </h2>
                    </div>
                    <div>
                      <h2 className="font-sans font-semibold">
                        Genres:{" "}
                        {movieGenre.map((option, i) => (
                          <span
                            key={i}
                            className="bg-gray-800 rounded-lg py-1 px-3 ml-2 text-sm"
                          >
                            {option}
                          </span>
                        ))}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black">
            <TorServer
              movieId={id}
              hash={movie?.hash}
              // backdrop_path={movie?.backdrop_path}
            />
          </div>
          <div className="bg-gray-900 py-12">
            <h2 className="text-white font-sans px-5 text-2xl font-semibold">
              You might also like:
            </h2>
            <div className="">
              <SimilarMovies genreIds={movie?.genre_ids} />
            </div>
            <br></br>
            <br></br>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default Watch;

import { useState, useEffect, useCallback, useMemo } from "react";
import { getMovieById } from "../util/ApiUtils";

const TorServer = ({ movieId, hash, backdrop_path }) => {
  const [movieObject, setMovieObject] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMovieById = useCallback(async () => {
    try {
      const response = await getMovieById(movieId);
      const data = await response.json();
      setMovieObject(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchMovieById();
  }, [fetchMovieById]);

  const webtor = useMemo(() => {
    return {
      id: "player",
      magnet: "" + hash,
      on: function (e) {
        if (e.name === window.webtor.TORRENT_FETCHED) {
          console.log("Torrent fetched!", e.data);
        }
        if (e.name === window.webtor.TORRENT_ERROR) {
          console.log("Torrent error!");
        }
      },
      poster: "https://image.tmdb.org/t/p/w500" + backdrop_path,
      subtitles: [],
      lang: "en",
      i18n: {
        en: {
          common: {
            "prepare to play": "Preparing Video Stream... Please Wait...",
          },
          stat: {
            seeding: "Seeding",
            waiting: "Client initialization",
            "waiting for peers": "Waiting for peers",
            from: "from",
          },
        },
      },
    };
  }, [hash, backdrop_path]);

  useEffect(() => {
    if (!loading) {
      window.webtor = window.webtor || [];
      window.webtor.push(webtor);
      console.log(window.webtor);
    }
  }, [loading, webtor]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="player" className="webtor flex justify-center items-center"></div>
  );
};

export default TorServer;

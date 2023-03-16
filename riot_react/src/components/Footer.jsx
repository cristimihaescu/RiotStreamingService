import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faInstagram,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="fixed bg-black text-white text-center font-sans py-0.5 mx-auto bottom-0 w-full bg-opacity-25">

      <div className="flex justify-center">
        <a href="#">
          <FontAwesomeIcon
            icon={faFacebookSquare}
            className="text-white m-2 text-2xl"
          />
        </a>
        <a href="#">
          <FontAwesomeIcon
            icon={faInstagram}
            className="text-white m-2 text-2xl"
          />
        </a>
        <a href="#">
          <FontAwesomeIcon
            icon={faTwitterSquare}
            className="text-white m-2 text-2xl"
          />
        </a>
      </div>
      <p className="text-white">Copyright &copy; {new Date().getFullYear()} </p>
      <b className="text-purple-600">RIOT STREAMING SERVICE</b>
    </footer>
  );
};

export default Footer;

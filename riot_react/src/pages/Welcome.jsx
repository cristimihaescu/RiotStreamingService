import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

const Welcome = () => {
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  return (
    <div className="h-screen">
      <Particles
        className="z-0 fixed"
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#111827",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "rgb(147, 131, 234)",
            },
            links: {
              color: "rgb(147, 131, 234)",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              directions: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      <Navbar showSearchBox={false} />
      <div className="h-screen flex items-center justify-center">
        <div className="text-white text-center py-10">
          <p className="relative font-sans font-semibold max-w-lg">
            Our app provides effortless access to all your favorite
            movies, ensuring that you never run out of options to watch. With
            regular updates and the latest releases, you can stay up to date
            with the most popular films in the industry. Enjoy seamless
            streaming with ease and indulge in the world of entertainment
            without any hassle.
          </p>
          <Link onClick={() => this.props.history.push("/home")} to="/home">
            <button className="relative mt-7 text-black font-sans bg-gradient-to-r from-purple-600 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-semibold rounded-lg text-sm px-5 py-2.5 text-center">
              Go to Home Page
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Welcome;

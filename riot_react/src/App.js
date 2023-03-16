import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import RegistrationForm from "./pages/RegistrationForm";
import LoginForm from "./pages/LoginForm";
import React, { useEffect } from "react";
import Watch from "./pages/Watch";
import useCurrentUser from "./components/useCurrentUser";
import { Container } from "react-bootstrap";
import Welcome from "./pages/Welcome";
import ProfilePage from "./pages/Profile";
import Footer from "./components/Footer";
function App() {
  const isLoggedIn = useCurrentUser();

  return (
    <div className="lg:p-0 bg-cover">
      {isLoggedIn ? (
        <Container fluid className="d-flex flex-column h-100">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Welcome />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Container>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/auth/register" element={<RegistrationForm />} />
            <Route path="/auth/login" element={<LoginForm />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;

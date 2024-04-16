import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./Login";
import Register from "./Register";
import HomePage from "./Homepage";
import { AuthProvider } from "./authentication/authContext";
import PrivateRoute from "./routes/PrivateRoute";
import Header from "./components/Header";
import Section from "./components/Section";

const App = () => {
  return (
    <AuthProvider>
      <>
        <div className="flex flex-col min-h-screen">
          <Header>
            <NavBar />
          </Header>
          <main className="flex-grow flex items-center justify-center ">
            <Section >
              <Routes>
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <HomePage />
                    </PrivateRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Section>
          </main>
          <Footer />
        </div>
      </>
    </AuthProvider>
  );
};

export default App;

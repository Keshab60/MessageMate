import { useState } from 'react'
import './App.css'
import Todo from './components/todo'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './components/Signup'
import Contactus from './components/Contactus'
import Aboutus from './components/Aboutus'
import Login from './components/Login'
import Otpverify from './components/Otpverify'
import Home from './components/Home'
import { useSelector } from "react-redux";
import Profile from './components/Profile'

function App() {
  const [change, setChange] = useState();

  // PrivateRoute component
  const PrivateRoute = ({ children }) => {
    const userId = useSelector((state) => state.user.id);
    if (!userId) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <>
      <Routes>
        {/* Homepage (only for logged in users) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Home />
              </>
            </PrivateRoute>
          }
        />

        {/* About page */}
        <Route
          path="/aboutus"
          element={
            <>
              <Navbar />
              <Aboutus />
            </>
          }
        />

        {/* Contact page */}
        <Route
          path="/contactus"
          element={
            <>
              <Navbar />
              <Contactus />
            </>
          }
        />

        {/* Auth pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otpverify" element={<Otpverify />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App

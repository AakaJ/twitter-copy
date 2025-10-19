import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Post from './pages/Post';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:postid" element={<Post />} />
        <Route path="/posts/user/:userid" element={<Profile />} />
        <Route path="/user/settings/:userid" element={<Settings />} />
      </Routes>
    </Router>
  )
}

export default App
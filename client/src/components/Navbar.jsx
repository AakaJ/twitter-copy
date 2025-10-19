import React from 'react'
import { Link } from "react-router-dom";
import LoginButton from './LoginButton';

const Navbar = () => {
  return (
    <nav className="flex justify-around p-[20px] sticky top-[0] bg-white">
        <Link to="/" className="text-2xl">Buzz</Link>
        <LoginButton />
    </nav>
  )
}

export default Navbar
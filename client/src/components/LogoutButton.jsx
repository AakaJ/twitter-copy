import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0();

  return (
    <div>
        {isAuthenticated && <button onClick={() => logout()} className="bg-red-500 h-[50px] w-[100px] rounded-xl cursor-pointer hover:bg-red-600 transition-all">Log Out</button>}
    </div>
  )
}

export default LogoutButton
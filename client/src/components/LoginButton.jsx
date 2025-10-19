import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoutButton from './LogoutButton';
import axios from "axios";

const LoginButton = () => {
    const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
    const [account, setAccount] = useState([]);
    const [values, setValues] = useState({
        userid: user?.sub,
    });

    const fetchAccountData = async (userId) => {
        try{
            if (!userId) return;
            const response = await axios.post("http://localhost:8080/account/find", { userid: userId });
            setAccount(response.data.account);
        }
        catch(error){
            console.error(`Failed fetching account data: ${error}`);
        }
    }

    useEffect(() => {
        if (user?.sub) {
            const decodedUserId = decodeURIComponent(user.sub);
            setValues({
                userid: decodedUserId,
            });
            fetchAccountData(decodedUserId);
        }
    }, [user])

  return (
    <div>
        {isLoading && <p>Loading...</p>}
        {!isAuthenticated && !isLoading && account ? 
            <button onClick={() => loginWithRedirect()} className="bg-blue-400 h-[50px] w-[100px] rounded-xl hover:bg-blue-500 transition-all cursor-pointer">Log in</button> 
            :
            <div className="flex items-center gap-[10px]">
                {account.map((account) => (
                    <Link to={`/posts/user/${account.userid}`} className="flex gap-[10px] items-center" key={account.userid}>
                        {account.profile_picture && <img src={account.profile_picture} className="w-[50px] rounded-full" />}
                        <h1 className="text-2xl">{account.username}</h1>
                    </Link>
                ))}
                <LogoutButton />
            </div>
        }
    </div>
  )
}

export default LoginButton
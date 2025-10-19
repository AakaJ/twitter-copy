import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from '../components/Navbar';
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";

const Settings = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { userid } = useParams();
    const [account, setAccount] = useState([]);
    const [values, setValues] = useState({
        username: null,
        profile_picture: null,
        bio: null,
    })
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false)
    const decodedUserId = userid ? decodeURIComponent(userid) : "";
    const sendUserId = {
        userid: decodedUserId,
    }
    
    const fetchAccountData = async () => {
        setLoading(true);
        setFailed(false);
        try{
            const response = await axios.post("http://localhost:8080/account/find", sendUserId)
            setAccount(response.data.account);
        }
        catch(error){
            setFailed(true);
            console.error(`Failed fetching account data: ${error}`);
        }
        finally{
            setLoading(false);
        }
    }

    const updateAccountData = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.put(`http://localhost:8080/account/${userid}`, values);
            fetchAccountData();
        }
        catch(error){
            console.error(`Failed updating account data: ${error}`);
        }
    }

    useEffect(() => {
        fetchAccountData();
    }, [])

    
    return (
        <div>
            <Navbar />
            <div>
                {!isLoading &&
                    <div>
                        {isAuthenticated && user.sub !== decodedUserId ?
                        <p>You do not have access to this account's settings</p>
                        :
                        <div className="p-[10px]">
                            <p className="text-2xl">Settings:</p>
                            <form onSubmit={updateAccountData}>
                                {account.map((account) => (
                                    <div key={account.userid}>
                                        <div>
                                            <img src={account.profile_picture} className="w-[200px] rounded-full" />
                                            <input type="text" placeholder="Enter a new profile picture link" onChange={(e) => setValues({...values, profile_picture: e.target.value})} className="bg-gray-100 w-[400px] h-[50px] rounded-xl p-[10px] mt-[5px]" />
                                        </div>
                                        <div className="mt-[10px]">
                                            <h1>Current Bio: {account.bio}</h1>
                                            <input type="text" placeholder="Enter a new bio" onChange={(e) => setValues({...values, bio: e.target.value})} className="bg-gray-100 w-[400px] h-[50px] rounded-xl p-[10px]" />
                                        </div>
                                        <div className="mt-[10px]">
                                            <h1>Current Username: {account.username}</h1>
                                            <input type="text" placeholder="Enter your new username" onChange={(e) => setValues({...values, username: e.target.value})} className="bg-gray-100 w-[400px] h-[50px] rounded-xl p-[10px]" />
                                        </div>
                                        <button type="submit" className="bg-blue-400 hover:bg-blue-500 transition-all rounded-xl w-[100px] h-[50px] mt-[10px]">Save</button>
                                    </div>
                                ))}
                            </form>
                        </div>
                        }
                    </div>
                }
                
                
            </div>
        </div>
    )
}

export default Settings
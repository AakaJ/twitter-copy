import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from '../components/Navbar';
import Posts from '../components/Posts';

const Home = () => {
    const { user, isAuthenticated } = useAuth0();
    const [account, setAccount] = useState("");
    const [findAccount, setFindAccount] = useState({
        userid: ""
    });
    const [addAccount, setAddAccount] = useState({
        userid: "",
        username: "",
        profile_picture: ""
    });

    // Update the account data when user info is available
    useEffect(() => {
        if (user) {
            const decodedUserId = decodeURIComponent(user.sub);
            setFindAccount({
                userid: decodedUserId
            });
            setAddAccount({
                userid: decodedUserId,
                username: user.name,
                profile_picture: user.picture
            });
        }
    }, [user]);

    

    const addUser = async () => {
        try{
            const response = await axios.post("http://localhost:8080/account", addAccount);
        }
        catch(error){
            console.error(`Failed adding account to database: ${error}`);
        } 
    }

    const findUser = async () => {
        if(user){
            try{
                const response = await axios.post("http://localhost:8080/account/find", findAccount)
                setAccount(response.data.message);
                // Only add user if no account was found in the response
                if(isAuthenticated && !response.data.message){
                    addUser()
                }
            }
            catch(error){
                console.error(`Failed finding user: ${error}`);
            }
        }
    }

    useEffect(() => {
        if (isAuthenticated && findAccount.userid) {
            findUser();
        }
    }, [isAuthenticated, findAccount.userid]) 

    return (
        <div>
            <Navbar />
            <Posts />
        </div>
    )
}

export default Home
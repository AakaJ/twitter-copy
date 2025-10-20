import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const { user, isAuthenticated } = useAuth0();
  const { userid } = useParams();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    }
  
  // Decode the URL-encoded user ID to replace %7C with |
  const decodedUserId = userid ? decodeURIComponent(userid) : "";

  const fetchUserPosts = async () => {
    setLoading(true);
    setFailed(false);
    try{
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts/user/${decodedUserId}`);
      setPosts(response.data.posts);
      if (response.data.account) {
        setProfile(response.data.account);
      }
    }
    catch(error){
      setFailed(true);
      console.error(`Failed loading posts: ${error}`);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    if (decodedUserId) {
      fetchUserPosts();
    }
  }, [decodedUserId])
  
  return (
    <div className='p-[10px]'>
      <Navbar />
      {profile && (
        <div className="mb-8">
          {profile?.profile_picture && <img src={profile.profile_picture} className="rounded-full w-[100px]" alt={profile.username} />}
          <h1 className="text-2xl">{profile.username}</h1>
          <p className="text-gray-500">Account Created: {formatDate(profile.created)}</p>
          {isAuthenticated && user?.sub === profile.userid ?
            <button onClick={() => navigate(`/user/settings/${userid}`)} className="bg-blue-400 hover:bg-blue-500 transition-all cursor-pointer w-[100px] h-[50px] rounded-xl">Settings</button>
            :
            null
          }
          <p>Bio: {profile.bio}</p>
        </div>
      )}
      <h1 className="text-3xl mb-4">Posts:</h1>
      {posts.map((post) => (
        <div key={post.id} className="border-[1px] p-[10px] rounded-xl mb-[10px]">
          {post.account && (
            <div className="flex items-center gap-[10px] mb-3">
              {post.account.profile_picture && (
                <img src={post.account.profile_picture} className="w-[50px] rounded-full" alt={post.account.username} />
              )}
              <p className="text-2xl">{post.account.username}</p>
            </div>
          )}
          <Link to={`/post/${post.id}`}>
            <p>{post.post}</p>
            <p className="text-gray-500 mt-2">Posted: {formatDate(post.posted_at)}</p>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Profile
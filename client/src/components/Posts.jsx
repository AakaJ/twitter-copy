import React from 'react'
import axios from "axios";
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const navigate = useNavigate();

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
    const { isAuthenticated, user } = useAuth0();
    const [values, setValues] = useState({
        username: user?.name,
        userid: user?.sub,
        profile_picture: user?.picture,
        postText: "",
    })

    const addPost = async (e) => {
        e.preventDefault();
        try{
            const postData = {
                ...values,
                username: user?.name,
                userid: user?.sub,
                profile_picture: user?.picture
            };
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/post`, postData);
            // Clear the post text after successful submission
            setValues(prev => ({ ...prev, postText: "" }));
            // Refresh the posts list
            fetchPosts();
        }
        catch(error){
            console.error(`Failed adding post: ${error}`);
        }
    }

    const fetchPosts = async () => {
        setFailed(false);
        setLoading(true);
        try{
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts`);
            setPosts(response.data.posts)
        }
        catch(error){
            setFailed(true);
            console.error(`Failed fetching posts: ${error}`);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, [])
  
    return (
        <div className="p-[10px] w-[800px] mr-auto ml-auto">
            {isAuthenticated ?
                <form onSubmit={addPost} className="mb-[10px]">
                    <input type="text" placeholder="What's happening?" className="w-[600px] h-[100px] outline-none rounded-xl bg-gray-100 p-[10px]" value={values.postText} onChange={(e) => setValues({...values, postText: e.target.value})} />
                    <button className="bg-blue-500 w-[165px] h-[100px] ml-[10px] rounded-xl hover:bg-blue-600 transition-all cursor-pointer">Post</button>
                </form>
                :
                <p>Log in to post yourself</p>
            }
            {posts.map((post) => (
                <div key={post.id} className="border-[1px] p-[10px] rounded-xl mb-[10px]">
                    <Link to={`/posts/user/${post.userid}`} className="flex items-center gap-[10px] mb-3 w-[100px]">
                        {post.profile_picture && (
                            <img src={post.profile_picture} className="w-[50px] rounded-full" alt={post.username} />
                        )}
                        <p className="text-2xl">{post.username}</p>
                    </Link>
                    <div onClick={() => navigate(`/post/${post.id}`)} className="cursor-pointer">
                        <p>{post.post}</p>
                        <p className="text-gray-500 mt-2">Posted: {formatDate(post.posted_at)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Posts
import React from 'react'
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import { useAuth0 } from "@auth0/auth0-react";


const Post = () => {
  const [post, setPost] = useState([]);
  const navigate = useNavigate();
  const { postid } = useParams();
  const { isAuthenticated, user } = useAuth0();
  const [values, setValues] = useState({
    postid: postid,
    userid: "",
    comment: ""
  });
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const fetchPost = async () => {
    setLoading(true);
    setFailed(false);
    try{
      const response = await axios.get(`http://localhost:8080/post/${postid}`);
      setPost(response.data.post);
    }
    catch(error){
      setFailed(true);
      console.error(`Failed fetching post: ${error}`);
    }
    finally{
      setLoading(false);
    }
  }

  const fetchComment = async () => {
    setLoading(true);
    setFailed(false);
    try{
      const response = await axios.get(`http://localhost:8080/comments/${postid}`);
      setComments(response.data.comments);
    }
    catch(error){
      setFailed(true)
      console.error(`Failed fetching comments: ${error}`);
    }
    finally{
      setLoading(false);
    }
  }

  const postComment = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post("http://localhost:8080/comment", values);
      fetchComment();
      setValues({
        postid: postid,
        userid: user?.sub,
        comment: ""
      })
    }
    catch(error){
      console.error(`Failed posting comment: ${error}`);
    }
  }

  useEffect(() => {
    setValues({
      postid: postid,
      userid: user?.sub,
      comment: "",
    })
  }, [user])

  useEffect(() => {
    fetchPost();
    fetchComment();
  }, []);
  
  return (
    <div>
      <Navbar />
      <div className="p-[10px] w-[800px] ml-auto mr-auto">
        {post.map((post) => (
          <div key={post.id} className="border-[1px] p-[10px] rounded-xl">
            <Link to={`/posts/user/${post.userid}`} className="flex gap-[10px] items-center">
              {post?.profile_picture && <img src={post.profile_picture} alt={post?.name} className="w-[50px] rounded-full" />}
              <h1 className="text-2xl">{post.username}</h1>
            </Link>
            <div>
              <p>{post.post}</p>
              <p className="text-gray-500">Posted: {formatDate(post.posted_at)}</p>
            </div>
          </div>
        ))}
        {!isAuthenticated ? 
          <p>Log in to comment yourself</p>
          :
          <div>
            <form onSubmit={postComment} className='mb-[10px] mt-[10px]'>
              <input type="text" className="w-[600px] h-[100px] outline-none rounded-xl bg-gray-100 p-[10px]" placeholder="Post a comment" onChange={(e) => setValues({...values, comment: e.target.value})} value={values.comment} />
              <button type="submit" className="bg-blue-500 w-[165px] h-[100px] ml-[10px] rounded-xl hover:bg-blue-600 transition-all cursor-pointer">Post</button>
            </form>
          </div>
        }
        <div className="text-2xl">Comments:</div>
        {!comments ? <p>No Comments...</p> : comments.map((comment) => (
          <div key={comment.id}>
            <div key={comment.id} className="border-[1px] p-[10px] rounded-xl mb-[10px]">
              <Link to={`/posts/user/${comment.userid}`} className="flex items-center gap-[10px] mb-3 w-[100px]">
                {comment?.profile_picture && <img src={comment.profile_picture} className="w-[50px] rounded-full" alt={comment.username} />}
                <p className="text-2xl">{comment.username}</p>
              </Link>
              <div>
                <p>{comment.comment}</p>
                <p className=" text-gray-500 mt-2">Posted: {formatDate(comment.commented_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Post
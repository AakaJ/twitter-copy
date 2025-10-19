import express from "express";
import cors from "cors";
const corsOptions = {
    origin: ["http://localhost:5173"],
}
import { saveAccount, addPost, viewPosts, viewUserPosts, viewPost, findAccount, postComment, viewComments, updateAccountData } from "./backend.js";
const app = express();

app.use(express.json());
app.use(cors(corsOptions));

// Add account to db

app.post("/account", async (req, res) => {
    const { username, userid, profile_picture } = req.body;
    try{
        const account = await saveAccount(userid, username, profile_picture);
        res.status(200).json({
            message: "Account was successfully created",
            account: account,
        })
    }
    catch(error){
        res.status(200).json({
            message: "Failed creating account",
            error: error.message,
        })
    }
})

// Find accounts on db

app.post("/account/find", async (req, res) => {
    try {
        const { userid } = req.body;
        
        // Validate userid
        if (!userid) {
            return res.status(200).json({
                message: false,
                error: "userid is required"
            });
        }
        const account = await findAccount(userid);

        if (!account || account.length === 0) {
            return res.status(201).json({
                message: false
            });
        }

        console.log("Account found:", account);
        return res.status(200).json({
            message: true,
            account: account
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(200).json({
            message: false,
            error: error.message
        });
    }
})

// get comments from db

app.get("/comments/:postid", async (req, res) => {
    const { postid } = req.params;
    try{
        const comment = await viewComments(postid);
        
        if(comment.length === 0){
            return res.status(200).json({
                message: "No comments found"
            })
        }

        res.status(200).json({
            comments: comment
        })
    }
    catch(error){
        res.status(200).json({
            message: "Failed viewing comments",
            error: error.message
        })
    }
})

// Add a comment

app.post("/comment", async (req, res) => {
    const { postid, userid, comment } = req.body;
    
    try{
        const commentData = await postComment(postid, userid, comment);
        res.status(200).json({
            message: "Comment was successfully added",
            comment: commentData,
        })
    }
    catch(error){
        res.status(200).json({
            message: "Failed posting comment",
            error: error.message,
        })
    }
})

// Post a post to the db

app.post("/post", async (req, res) => {
    const { userid, postText } = req.body;
    try{
        const postData = await addPost(userid, postText);
        res.status(200).json({
            message: "Post was successfully added",
            post: postData,
        })
    }
    catch(error){
        res.status(200).json({
            message: "Failed adding post",
            error: error.message,
        })
    }
})

// Edit account details

app.put("/account/:userid", async (req, res) => {
    const { userid } = req.params;
    const { username, profile_picture, bio } = req.body;
    
    try{
        const account = await updateAccountData(userid, username, profile_picture, bio);
        res.status(200).json({
            message: "Account successfully updated",
            account: account,
        })
    }
    catch(error){
        res.status(200).json({
            message: "Failed updating account data",
            error: error.message
        })
    }
})

// Post a comment to the db

app.post("/comment", async (req, res) => {
    const { userid, comment, postid } = req.body;

    try{
        const postedComment = await postComment(postid, userid, comment);
        res.status(200).json({
            message: "Comment posted successfully",
            comment: postedComment,
        })
    }
    catch(error){
        res.status(200).json({
            message: "Failed posting comment",
            error: error.message,
        })
    }
})

// view all posts

app.get("/posts", async (req, res) => {
    try {
        const posts = await viewPosts();

        res.status(200).json({
            posts: posts,
        });
    }
    catch(error){
        res.status(200).json({
            message: "Failed loading posts",
            error: error.message,
        })
    }
})

// Find posts of the account

app.get("/posts/user/:userid", async (req, res) => {
    const { userid } = req.params;
    try{
        // Get the user's account first
        const account = await findAccount(userid);
        
        // Get the user's posts
        const posts = await viewUserPosts(userid);
        
        // Attach the account information to each post
        const postsWithAccount = posts.map(post => ({
            ...post,
            account: account[0] || null
        }));

        res.status(200).json({
            posts: postsWithAccount,
            account: account[0] || null
        });
    }
    catch(error){
        res.status(200).json({
            message: "Failed fetching posts from user",
            error: error.message,
        })
    }
})

// View a specific post

app.get("/post/:postid", async (req, res) => {
    const { postid } = req.params;
    try{
        const post = await viewPost(postid);
        res.status(200).json({
            post: post,
        })
    }
    catch(error){
        res.status(200).json({
            message: "Failed viewing post",
            error: error.message,
        })
    }
})

app.listen(8080, () => {
    console.log("Server started on port 8080");
})
import mysql from "mysql2";
import dotenv from "dotenv"
dotenv.config();

const pool = mysql.createPool({
    host: process.env.BACKEND_SQL_HOST,
    database: process.env.BACKEND_SQL_DATABASE,
    password: process.env.BACKEND_SQL_PASSWORD,
    user: process.env.BACKEND_SQL_USER
}).promise()

export const saveAccount = async (userid, username, profile_picture) => {
    const result = await pool.query(`
        INSERT INTO accounts (userid, username, profile_picture)
        VALUES(?, ?, ?)
    `, [userid, username, profile_picture])
    return result;
}

export const findAccount = async (userid) => {
    try {
        const [account] = await pool.query(`
            SELECT * FROM accounts WHERE userid = ?
        `, [userid]);
        return account;
    } catch (error) {
        console.error("Database error in findAccount:", error);
        throw error;
    }
}

export const addPost = async (userid, postText) => {
    const post = await pool.query(`
        INSERT INTO post (userid, post)
        VALUES(?, ?)
    `, [userid, postText])
    return post;
}

export const viewUserPosts = async (userid) => {
    const [result] = await pool.query(`
        SELECT * FROM post p WHERE userid = ?
    `, [userid])
    return result;
}

export const viewPosts = async () => {
    const [rows] = await pool.query(`
        SELECT * FROM post p
        JOIN accounts a ON p.userid = a.userid
        ORDER BY posted_at DESC
    `);
    return rows;
}

export const viewPost = async (postid) => {
    const [post] = await pool.query(`
        SELECT 
        * 
        FROM post p 
        JOIN accounts a ON p.userid = a.userid
        WHERE id = ?
    `, [postid])
    return post;
}

export const postComment = async (postid, userid, comment) => {
    const [commentQuery] = await pool.query(`
        INSERT INTO comments (postid, userid, comment)
        VALUES(?, ?, ?)
    `, [postid, userid, comment])
    return commentQuery;
}

export const viewComments = async (postid) => {
    const [comments] = await pool.query(`
        SELECT * FROM comments c
        JOIN accounts a ON c.userid = a.userid
        WHERE postid = ?
        ORDER BY commented_at DESC
    `, [postid])
    return comments;
}

export const updateAccountData = async (userid, username, profile_picture, bio) => {
    const [update] = await pool.query(`
        UPDATE accounts
        SET
        username = COALESCE(?, username),
        profile_picture = COALESCE(?, profile_picture),
        bio = COALESCE(?, bio)
        WHERE userid = ?
    `, [username, profile_picture, bio, userid])
    return findAccount(userid);
}
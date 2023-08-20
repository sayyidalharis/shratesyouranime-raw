// get the data from user_data table
//
// Compare this snippet from pages\api\single-trained.js:
// pages/api/single-trained/[id].js
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export default async function handler(req, res) {
    const { id } = req.query;
    
    if (req.method === 'GET') {
        try {
        const db = await open({
            filename: 'anime_database.db',
            driver: sqlite3.Database,
        });
    
        // get the data from user_data table and the comment count from comments table
        const trainedData = await db.get(
            'SELECT user_data.*, COUNT(comments.id) as comment_count FROM user_data LEFT JOIN comments ON user_data.id = comments.user_character_id WHERE user_data.id = ? GROUP BY user_data.id',
            id
        );
    
        return res.status(200).json(trainedData);
        } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    // Handle other HTTP methods if needed
    }
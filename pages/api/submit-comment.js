import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export default async function handler(req, res) {
    if(req.method != "POST"){
        return res.status(405).end();
    }

    // get data from trained=data/[id].js
    const { imageId, username, comment } = req.body;

    try {
        const db = await open({
            filename: 'anime_database.db',
            driver: sqlite3.Database,
        });

        // Insert data into the database
        const result = await db.run(
            'INSERT INTO comments (character_id, user_name, comment_text) VALUES (?, ?, ?)',
            [imageId,
            username,
            comment]
        );

        // Send success response
        return res.status(200).json({ success: true, message: "new comment added"});
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
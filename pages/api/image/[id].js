
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export default async function handler(req, res) {

    // if other than get return nothing
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }
    try{

        const db = await open({
            filename: 'anime_database.db',
            driver: sqlite3.Database
        });
    
        // get the image from user_data table
        const comment = await db.get('SELECT image_path FROM user_data WHERE id = ?', req.query.id);

        return res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', error });
    }
}
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Define the path to the SQLite 
    const dbPath = "anime_database.db"

    // Open the database connection
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Query the database to get trained data
    const trainedData = await db.all(
      'SELECT user_data.*, COUNT(comments.id) as comment_count FROM user_data LEFT JOIN comments ON user_data.id = comments.user_character_id GROUP BY user_data.id'
    );

    // Close the database connection
    await db.close();

    return res.status(200).json(trainedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

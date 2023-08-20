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

    // Query the database to get trained data and each comment count
    const trainedData = await db.all(
      'SELECT training_data.*, COUNT(comments.id) as comment_count FROM training_data LEFT JOIN comments ON training_data.id = comments.character_id GROUP BY training_data.id'
      );

    // Close the database connection
    await db.close();

    return res.status(200).json(trainedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

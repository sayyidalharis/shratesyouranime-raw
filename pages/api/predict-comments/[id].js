// pages/api/image-comments/[id].js
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

      const comments = await db.all(
        'SELECT * FROM comments WHERE user_character_id = ?',
        id
      );

      return res.status(200).json(comments);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle other HTTP methods if needed
}

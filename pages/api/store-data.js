import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    // Parse the data from upload.js
    const { rating, croppedImage, animeName } = req.body;
    // const rating = req.body.rating;

    // Retrieve the latest ID from the training_data table
    const db = await open({
      filename: 'anime_database.db',
      driver: sqlite3.Database,
    });

    //get the latest id from the database
    const latestId = await db.get('SELECT id FROM user_data ORDER BY id DESC LIMIT 1');

    // plus 1 to the latest id to get the new id for the new data and 1 if the database is empty
    const newId = latestId ? latestId.id + 1 : 1;

    // resize the croppedImage to width 500
    const image = await sharp(Buffer.from(croppedImage, 'base64'))
      .resize({ width: 500 })
      .toBuffer();

    // store the image to database as blob
    const imageBlob = Buffer.from(image, 'base64');

    // Insert data into the database
    const result = await db.run(
        'INSERT INTO user_data (id, attractiveness_prediction, image_path, name) VALUES (?, ?, ?, ?)',
        [newId,
        rating,
        imageBlob,
        animeName]
    );

    // Send success response
    return res.status(200).json({ success: true, message: "new ID : "+ newId});
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

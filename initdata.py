import sqlite3
import csv

# Connect to the SQLite database
db_connection = sqlite3.connect('anime_database.db')
cursor = db_connection.cursor()

# Read and insert data from the CSV file
with open('trainedit.csv', 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        image_url = row['image_url']
        attractiveness = float(row['attractiveness'])
        name = row['name']

        # Insert the data into the training_data table
        cursor.execute("INSERT INTO training_data (name, image_path, attractiveness_rating) VALUES (?, ?, ?)",
                       (name, image_url, attractiveness))

# Commit changes and close the connection
db_connection.commit()
db_connection.close()

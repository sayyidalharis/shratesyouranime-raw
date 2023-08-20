import { useState } from 'react';
import styles from '../styles/upload.module.css';
import Link from 'next/link';

export default function Upload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [displayImage, setDisplayImage] = useState(null);
    const [predictedRating, setPredictedRating] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [databaseSubmitted, setDatabaseSubmitted] = useState(false); // Assuming you have a state for this
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setSelectedImage(file);
    //   setPredictedRating(null);
      // Do not clear the croppedImage state here
    };
  
    const handleUpload = async () => {
      if (!selectedImage) return;
    
      setDisplayImage(selectedImage);
      const formData = new FormData();
      formData.append('image', selectedImage);
  
      try {
        const response = await fetch('http://127.0.0.1:5000/upload-image', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        console.log(data.predicted_rating);
        setPredictedRating(data.predicted_rating);
        setCroppedImage(data.cropped_image);
        setDatabaseSubmitted(false); // Assuming you have a state for this
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const handleSubmitToDatabase = async () => {
        if (!croppedImage || !predictedRating) return;

        try {
          const response = await fetch('/api/store-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rating: predictedRating,
                croppedImage,
            }),
          });

          const result = await response.json();
    
          // Handle the response as needed
          if (result.success) {
            // get the response from the server
            console.log(result.message);
            setDatabaseSubmitted(true); // Assuming you have a state for this
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    return (
      <div className={styles.container}>
        <h1>Upload Anime Image</h1>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleUpload}>Upload</button>
  
        {croppedImage && (
          <div>
            <p>Predicted Attractiveness Rating: {predictedRating}</p>
            {/* Display the raw image from the user with max width small */}
            {displayImage && (
              <img src={URL.createObjectURL(displayImage)} alt="Raw Anime" style={{ maxWidth: '300px' }} />
            )}
            {/* Display the cropped image */}
            <div>
              {croppedImage && (
                <img src={`data:image/jpeg;base64,${croppedImage}`} alt="Cropped Anime" />
              )}
              {/* Button to submit to the database */}
              <button onClick={handleSubmitToDatabase}> Submit to Database</button>
              {databaseSubmitted && <p>Data has been successfully submitted to the database.</p>}
            </div>
          </div>
        )}
        {/* if predictedrating says there's no data */}
        {predictedRating == "No face detected" && (
            <div>
                <p>Predicted Attractiveness Rating: {predictedRating}</p>
            </div>
        )}

  
        <Link href="/">Back to Home</Link>
      </div>
    );
  }
  

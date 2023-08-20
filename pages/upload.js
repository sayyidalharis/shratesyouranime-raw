import { useState } from 'react';
import styles from '../styles/upload.module.css';
import Link from 'next/link';
import Head from 'next/head';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faStarHalfAlt  as halfStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Upload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [displayImage, setDisplayImage] = useState(null);
    const [predictedRating, setPredictedRating] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [dbSubmittedEach, setDbSubmittedEach] = useState(false); // Assuming you have a state for this
    const [databaseSubmitted, setDatabaseSubmitted] = useState(false); // Assuming you have a state for this
    const [animeName, setAnimeName] = useState([]);
    const [autoComments, setAutoComments] = useState([]); // Assuming you have a state for this
    const [loading, setLoading] = useState(false);


    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setSelectedImage(file);
    //   setPredictedRating(null);
      // Do not clear the croppedImage state here
    };
  
    const handleUpload = async () => {
      if (!selectedImage) {
        // alert the user that they need to select an image
        alert('Please select an image first.');
        return;
      }
      setLoading(true); // Start loading
    
      setDisplayImage(selectedImage);
      const formData = new FormData();
      formData.append('image', selectedImage);
  
      try {
        const response = await fetch('https://shrateyouranime-9537878579bd.herokuapp.com/upload-image', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        console.log(data.predicted_rating);
        setPredictedRating(data.predicted_rating);
        setCroppedImage(data.cropped_image);
        generateAutoComment(data.predicted_rating);
        setDatabaseSubmitted(false); // Assuming you have a state for this
        if(data.predicted_rating.length > 1){
            // make an array of false with length of predicted_rating
            let temp = [];
            for(let i = 0; i < data.predicted_rating.length; i++){
                temp.push(false);
            }
            setDbSubmittedEach(temp);
        }
        else{
            let temp = [];
            temp.push(false);
            setDbSubmittedEach(temp);
        }
      } catch (error) {
        console.error('Error:', error);
        // alert the user that there's an error
        alert("There's an error, please contact me via sns on the footer.");
      } finally{
        setLoading(false); // Stop loading
      }
    };
  
    const handleSubmitToDatabase = async () => {
        if (!croppedImage || !predictedRating) return;

        // loop through croppedImage and predictedRating
        for (let i = 0; i < croppedImage.length; i++) {
          try{
            const response = await fetch('/api/store-data', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  rating: predictedRating[i],
                  croppedImage: croppedImage[i],
                  animeName: animeName[i],
              }),
            });
            
            const result = await response.json();

            // Handle the response as needed
            if (result.success) {
              // get the response from the server
              console.log(result.message);
            } else {
              console.error('Error:', response.statusText);
            }
          }
          catch (error) {
            console.error('Error:', error, 'at index', i);
          }
        }
        setDatabaseSubmitted(true); // Assuming you have a state for this
        
    }

      
    const handleSubmitSingle = async (index) => {
      if (!croppedImage || !predictedRating) return;


      try {
        // store the data to the database with image as blob
        const response = await fetch('/api/store-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              rating: predictedRating[index],
              croppedImage: croppedImage[index],
              animeName: animeName[index],
          }),
        });
        
        const result = await response.json();

        // Handle the response as needed
        if (result.success) {
          // get the response from the server
          console.log(result.message);
          // if dbSubmittedEach only has one data, set it to true
        
          let temp = [...dbSubmittedEach];
          temp[index] = true;
          setDbSubmittedEach(temp);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const generateStarRating = (rating) => {
      rating = parseFloat(rating).toFixed(1); // Round rating to nearest tenth
      console.log(rating)
      const stars = [];
      const solidCount = Math.floor(rating / 2); // Calculate the number of solid stars
      // if the rating left is greater than 1, then we have a half star
      const hasHalfStar = rating - (solidCount * 2) >= 1;
  
      for (let i = 0; i < 5; i++) {
        if (i < solidCount) {
          stars.push(<FontAwesomeIcon key={i} icon={solidStar} />);
        } else if (hasHalfStar && i === solidCount) {
          stars.push(<FontAwesomeIcon key={i} icon={halfStar} />);
        } else {
          stars.push(<FontAwesomeIcon key={i} icon={regularStar} />);
        }
      }
  
      return stars;
    };
    
  const generateAutoComment = (ratingArray) => {
    // if the ratingArray is empty, return nothing
    if (ratingArray.length === 0) return;
    // if the ratingArray has more than 1 data, return a list of comments for each rating
    const rated10 = [
      'You are a perfect 10!',
      'Absolutely stunning!',
      'Flawless masterpiece',
      'Mind-blowing creativity!',
      'Perfection achieved',
    ];
    const rated9 = [
      'A masterpiece in every sense!',
      'Breathtakingly beautiful!',
      'Perfection in the making',
      'Unbelievably outstanding!',
      'The pinnacle of creativity',
    ];
    const rated8 = [
      'You are top-tier material!',
      'Impressive, very impressive',
      'Wow, just wow!',
      'Incredible work!',
      'You should be proud of this',
    ];
    const rated7 = [
      'Impressive display of talent!',
      'You are shining brightly!',
      'Clearly above the rest',
      'Good work of art!',
      'People will remember this',
    ];
    const rated6 = [
      'You are doing pretty good!',
      'Above average, keep it up',
      'Impressive work!',
      'Definitely catching some eyes',
      'Solid effort',
    ];
    const rated5 = [
      
      'You\'re not bad, but not good either – the epitome of average.',
      'If being unremarkable was an achievement, you\'d be a champion.',
      'You\'re cruising right down the middle of the road to blandness.',
      'In a world of creativity, you\'re the plain white wall.',
      'Middle-of-the-pack? More like middle-of-everything.',    
    ];
    const rated4 = [
      'You managed to achieve the pinnacle of mediocrity.',
      'Uninspiring, to say the least.',
      'You are the embodiment of "meh".',
      'It\'s like you aimed for average and overshot it slightly.',
      'Congratulations, you\'ve mastered the art of being forgettable.',    
    ];
    const rated3 = [
      'You have some potential, but not much',
      'Meh, just meh',
      'I guess you exist',
      'Room for improvement, maybe?',
      'Average at best',
    ]; 
    const rated2 = [
      'Barely scraping by, huh?',
      'Could use a lot of improvement',
      'A valiant effort, I guess',
      'Needs some serious work',
      'You are testing my patience',
    ];
    const rated1 = [
      
      'You are pretty... ugly',
      'Guess I\'ll have to give you a pity point',
      'The universe weeps at your lack of beauty.',
      'An utter disappointment in every way.',
    ];
    const rated0 = [
      'You are the lowest of the lows',
      'Does your creator even love you?',
      'Not even trying, huh?',
      'This is just painful to look at',
      'Is this a joke?',
    ];
    if (ratingArray.length >= 1) {
      // check each rating and return a comment for each rating in to autoCommentsTemp then setAutoComments
      let autoCommentsTemp = [];
      for (let i = 0; i < ratingArray.length; i++) {
        // loop the ratingArray and check each rating
        let tempRating = parseFloat(ratingArray[i]).toFixed(1);
        if (tempRating >= 10) {
          autoCommentsTemp.push(rated10[Math.floor(Math.random() * rated10.length)]);
        } else if (tempRating >= 9) {
          autoCommentsTemp.push(rated9[Math.floor(Math.random() * rated9.length)]);
        } else if (tempRating >= 8) {
          autoCommentsTemp.push(rated8[Math.floor(Math.random() * rated8.length)]);
        } else if (tempRating >= 7) {
          autoCommentsTemp.push(rated7[Math.floor(Math.random() * rated7.length)]);
        } else if (tempRating >= 6) {
          autoCommentsTemp.push(rated6[Math.floor(Math.random() * rated6.length)]);
        } else if (tempRating >= 5) {
          autoCommentsTemp.push(rated5[Math.floor(Math.random() * rated5.length)]);
        } else if (tempRating >= 4) {
          autoCommentsTemp.push(rated4[Math.floor(Math.random() * rated4.length)]);
        } else if (tempRating >= 3) {
          autoCommentsTemp.push(rated3[Math.floor(Math.random() * rated3.length)]);
        } else if (tempRating >= 2) {
          autoCommentsTemp.push(rated2[Math.floor(Math.random() * rated2.length)]);
        } else if (tempRating >= 1) {
          autoCommentsTemp.push(rated1[Math.floor(Math.random() * rated1.length)]);
        } else if (tempRating >= 0) {
          autoCommentsTemp.push(rated0[Math.floor(Math.random() * rated0.length)]);
        }
        console.log(i, tempRating)

      }
      setAutoComments(autoCommentsTemp);
    }
  };

    return (
      <div className={styles.container}>
      <Head>
        <title>Upload</title>
      </Head>
      <div className={styles.main}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Loading...</p>
          </div>
        )}

        
        <div className={styles.getData}>
        <h1>Upload Anime Image</h1>
        <div className={styles.authorMessage}>
          <p >sry for the messy page, would make it pretty later! it shd still get the job done though ♡</p>
          <p>if you have any questions, feel free to contact me via sns on the footer!</p>
          {/* link to review page */}
          <p className={styles.reviewmsg}>
            <span>or you can go to </span>
            <Link href="/reviews">
              Review page
            </Link>
            <span> to review the page, share your thoughts, or anything you wanna say to me xoxo</span>
          </p>
        </div>
        <p className={styles.p}>Upload your anime image and get the rating!</p>
        <label htmlFor="fileInput" className={styles.customFileInput}>
            Choose File
        </label>
        { selectedImage && (
          // get first 10 characters of the name or the name before the dot if it's less than 10 characters
          <p className={styles.fileName}>{selectedImage.name.length > 10 ? selectedImage.name.substring(0, 10) + '..' + selectedImage.type.substring(6, 10): 
          selectedImage.name.split('.')[0] + '.' + selectedImage.type.substring(6, 10)}</p>
          

        )}

        <input
            id="fileInput"
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleImageChange}
        />

        <button onClick={handleUpload} className={styles.uploadButton}>Upload</button>
        {/* there are many images in croppedImage and many ratings in predictedRating */}
        {/* iterate them all to display every data to users */}
        </div>
        <div className={styles.displayContainer}>
          {displayImage && (
                <img src={URL.createObjectURL(displayImage)} alt="Raw Anime"  className={styles.displayImage} />
          )}
        </div>
        {croppedImage && (
          <h1>Result :</h1>
        )}

        {croppedImage && croppedImage.map((image, index) => (
            <div key={index} className={styles.croppedImageContainer}>
                {/* rating only 2 decimals */}
                <p className={styles.ratingText}>Rating: {predictedRating[index].toFixed(2)}/10</p>
                <div className={styles.starRating}>"{generateStarRating(predictedRating[index].toFixed(2))}"</div>
                <div className={styles.ratingComment}>"{autoComments[index]}"</div>
                <img src={`data:image/jpeg;base64,${image}`} alt="cropped" 
                            className={styles.croppedImage}/>
                {/* get the user to input the name of the anime */}
                <input type="text" placeholder="Character Name" onChange={(e) => {
                    let temp = [...animeName];
                    temp[index] = e.target.value;
                    setAnimeName(temp); 
                }} className={styles.animeNameInput}/>
                {/* button to submit to the database */}
                <button onClick={() => handleSubmitSingle(index)} className={styles.submitButton}>Submit to Database</button>
                {/* check the dbSubmittedEach status */}
                {dbSubmittedEach[index] && <p className={styles.successText}>Successfully submitted to the database.</p>}
            </div>            
        ))}
        {/* check if length of predictedRating more than one, if yes make a button of submit all img to db */}
        {croppedImage && croppedImage.length > 1 && (
              <div className={styles.submitAllButtonContainer}>
              <button
                  onClick={handleSubmitToDatabase}
                  className={styles.submitAllButton}
              >
                  Submit All to Database
              </button>
          </div>
        )}
        {databaseSubmitted && <p className={styles.successText}>ALl data has been successfully submitted to the database.</p>}
        {/* if predictedrating says there's no data */}
        {predictedRating == "No face detected" && (
            <div>
                <p className={styles.noDataMessage}>Predicted Attractiveness Rating: {predictedRating}</p>
            </div>
        )}
        <div className={styles.lastGap}>

        </div>
      </div>
      </div>
    );
  }
  

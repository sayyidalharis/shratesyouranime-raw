import React from 'react';
import Link from 'next/link';
import styles from '../styles/welcome.module.css'; // Import your CSS module
import Head from 'next/head';



const HomePage = () => {
  console.log('Welcome to My Auto Rating Your Fav Anime Chara App');
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <meta name="google-site-verification" content="11NTk4i5yzpA6MZYuDHNBraRRMxQF6jNkrO6h5-JMP4" />
      </Head>
      <h1 className={styles.heading}>Welcome to <br/> RATE YOUR ANIME CHARACTERS SITE!</h1>
      <div className={styles.explanation}>
        <p className={styles.explanationText}>
          "Sh's totally not biased anime face rating" is a dedicated web application for all the anime enthusiasts out there. 
          Ever wondered how attractive your favorite anime characters are? 
        </p>
        <p className={styles.explanationText}>
          With our innovative platform, you can upload images of your beloved anime characters, and our advanced machine learning model will predict their attractiveness ratings. 
        </p>
        <p className={styles.explanationText}>
          It's a fun and interactive way to engage <br/> with your favorite characters!
        </p>
      </div>
      <div className={styles.links}>
        <div className={styles.linkItem}>
          <Link href="/trained-data">
              <img src="trained_data.png" alt="Trained Data" />
              <p>Trained Data</p>
          </Link>
        </div>
        <div className={styles.linkItem}>
          <Link href="/submitted-data">
              <img src="submitted_data.png" alt="User Predictions" />
              <p>AI Predictions</p>
          </Link>
        </div>
        <div className={styles.linkItem}>
          <Link href="/upload">          
              <img src="submit_image.png" alt="Submit Image" />
              <p>Submit Image</p>
          </Link>
        </div>
      </div>
      <h1 className={styles.heading2}> Key Features </h1>
      <div className={styles.explanation2}>
        <p className={styles.explanationText}>
        1. <b>Submit Image and Prediction</b> : <br/> <br/> 
        Have a particular character in mind? Upload the image of the character, and our system will analyze and predict their attractiveness on a scale from 1 to 10. See how your favorite characters stack up in terms of visual appeal!
        </p>
        <p className={styles.explanationText}>
        2. <b>Comments and Community</b> : <br/> <br/> 
        Share your thoughts and opinions! You can leave comments on images, creating a vibrant community where anime fans can discuss and express their views.        </p>
        <p className={styles.explanationText}>
        3. <b>Trained Data Display</b> : <br/> <br/> 
        Explore a collection of images that have been used to train our machine learning model. Get insights into the types of characters that have been analyzed and rated.        </p>
        <p className={styles.explanationText}>
        4. <b>User Predictions Gallery</b> : <br/> <br/> 
        Discover images uploaded by fellow users along with their attractiveness predictions. It's a showcase of the diverse and captivating world of anime characters! Go check <b>previous predictions  </b>
        {/* link to user predictions page */}
        <Link href="/submitted-data"> here</Link>,
        or <b> upload the image </b> yourself to get the characters' attractiveness predictions
        {/* link to upload page */}
        <Link href="/upload"> here</Link>.
        </p>
      </div>
      <div className={styles.explanation2}>
        <p className={styles.explanationTextz}>
          {/* link to reviews page */}
          <Link href="/reviews">Click here</Link> to see what our users have to say about our app or you can leave your message too!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
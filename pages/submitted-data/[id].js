// pages/trained-data/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/imageDetail.module.css';
import Head from 'next/head';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faStarHalfAlt  as halfStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



export default function ImageDetail({ imageId }) {
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // get all data from query
    console.log(router.query);

    // if no image_path and attractiveness_prediction, get the data from the API route "single-trained.js"
    if (!router.query.image_path && !router.query.attractiveness_prediction) {
        fetch(`/api/single-predict/${imageId}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            router.query.image_path = data.image_path;
            router.query.attractiveness_prediction = data.attractiveness_prediction;
            router.query.comment_count = data.comment_count;
            router.query.charaname = data.className
            // turn the image_path from Buffer to base64 string that can be displayed
            const base64 = btoa(
                new Uint8Array(data.image_path.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                ),
            );
            setImage(base64);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    // if no image_path
    if (!router.query.image_path && router.query.attractiveness_prediction) {
      // fetch image from image/[id].js
      fetch(`/api/image/${imageId}`)
        .then((response) => response.json())
        .then((data) => {
          // turn the image_path from Buffer to base64 string that can be displayed
          const base64 = btoa(
            new Uint8Array(data.image_path.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
          );
          setImage(base64);
        }
        )
    }

    // Fetch comments for the current image using the API route
    fetch(`/api/predict-comments/${imageId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(router.query)
        console.log(data);
        setComments(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleSubmitComment = async () => {
    if (!comment) return;

    setLoading(true);

    try {
      const response = await fetch('/api/submit-predict-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: imageId,
          username: username || 'Anonymous', // Use the username or 'Anonymous' if empty
          comment: comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Comment submitted successfully, you might want to update comment_count here
        console.log('Comment submitted successfully');
        const commentsResponse = await fetch(`/api/predict-comments/${imageId}`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
        // if comment count value is string convert it to integer
        if (typeof router.query.comment_count === 'string') {
            router.query.comment_count = parseInt(router.query.comment_count);
        }
        router.query.comment_count += 1;

        setComment(''); // Clear the comment input
        setUsername(''); // Clear the username input
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }

    setLoading(false);
    setComment('');
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

  return (
    <div className={styles.container}>
      {/* display image */}
      <Head>
        <title>{router.query.charaname + "'s Page"}</title>
        {/* <title>ow</title> */}
      </Head>
      <div className={styles.main}>
        {/* wait until they are ready */}
        {image && router.query.attractiveness_prediction ? (
            <div className={styles.imageInfoContainer}>
                <div className={styles.imageOverlay}>
                  <img src={`data:image/jpeg;base64,${image}`} alt={`Anime ${imageId}`} />
                </div>
                <div className={styles.infoOverlay}>
                  {/* if name is null or emptystring, display "Unknown" */}
                  <h2>{router.query.charaname ? router.query.charaname : "Unknown"}</h2>
                  <div className={styles.starRating}>{generateStarRating(parseFloat(router.query.attractiveness_prediction).toFixed(1))}</div>
                  <p>Attractiveness Prediction : <b>{parseFloat(router.query.attractiveness_prediction).toFixed(2)}</b> / 10 </p>
                  <p>Comments Available : <b>{router.query.comment_count}</b> </p>
                </div>
            </div>
        ) : (
            <div>Loading...</div>
        )}
      
    <div className={styles.inputContainer}>
     <div className={styles.commentSection}>
      <div className={styles.inputWrapper}>
          <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name (optional)"
                disabled={loading}
            />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here"
            disabled={loading}
          />
      </div>
        {/* make a username input */}
        <button className={styles.inputButton} onClick={handleSubmitComment} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </div>
    </div>

      {/* check if comments data exist */}
      {comments['error'] == "Internal server error" || comments.length == 0 ? (
            <div></div>
        ) : (
            <div>
                <div className={styles.commentsContainer}>
                    <h2>Comments:</h2>
                    <ul>
                    {comments.map((comment) => (
                        // display the username and comment_text
                        <li key={comment.id}><b>{comment.user_name}</b>: {comment.comment_text}</li>
                    ))}
                    </ul>
                </div>
            </div>
        )}
    </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  return {
    props: {
      imageId: id,
    },
  };
}

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/welcome.module.css'; // Import your CSS module
import Head from 'next/head';

// make a closing page that says thanks for the visit and please leave a review or comments of the site

export default function Reviews() {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Fetch comments for the current image using the API route
        fetch(`/api/trained-comments/2`)
          .then((response) => response.json())
          .then((data) => {
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
          const response = await fetch('/api/submit-comment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageId: 373,
              username: username || 'Anonymous', // Use the username or 'Anonymous' if empty
              comment: comment,
            }),
          });
    
          const data = await response.json();
    
          if (data.success) {
            // Comment submitted successfully, you might want to update comment_count here
            console.log('Comment submitted successfully');
            const commentsResponse = await fetch(`/api/trained-comments/373`);
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Review</title>
      </Head>
      <h2>Welcome to</h2>
      <h1 className={styles.heading2}>Review Page!</h1>
      <div className={styles.explanation}>
        <p className={styles.explanationText}>
          Please have a look around and leave a review or comment on the site. I would love to hear your thoughts and opinions!
        </p>
      </div>
        
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
    <div className={styles.listComments}>
      <h2 className={styles.heading2}> Comments </h2>
      {comments['error'] == "Internal server error" || comments.length == 0 ? (
            <div></div>
        ) : (
            <div>
                <div className={styles.commentsContainer}>
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
};
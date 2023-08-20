import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className= {styles.footerContent}>
        <div className={styles.social_media_icons}>
          <a href="https://www.instagram.com/sayyidhrs" target="_blank" rel="noopener noreferrer">
            {/* display iamge of instagram-icon.png */}
            <img src="/instagram-icon.png" alt="instagram-icon" className={styles.snsImg}/>
          </a>
          <a href="https://www.linkedin.com/in/sayyid-haris-b6814b1ab" target="_blank" rel="noopener noreferrer">
            <img src="/linkedin-icon.png" alt="LinkedIn" className={styles.snsImg}/>
          </a>
        </div>
        <p>&copy; 2023 Meeps. All rights reserved.</p>
      </div>
    </footer>
  );
}

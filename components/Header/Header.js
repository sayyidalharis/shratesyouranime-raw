import Link from 'next/link';
import styles from './Header.module.css';


function Header() {
  return (
    <header className={`${styles.header} ${styles.sticky}`}>
      <nav className={styles.navContainer}>
        <div className={styles.leftNav}>
          <Link href="/" className={styles.navLink}>Home</Link>
        </div>
        <div className={styles.rightNav}>
          <Link href="/trained-data" className={styles.navLink}>Trained Data</Link>
          <Link href="/submitted-data" className={styles.navLink}>AI Predictions</Link>
          <Link href="/upload" className={styles.navLink}>Submit Image</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;

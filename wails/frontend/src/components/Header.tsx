import styles from './header.module.css';

export default function Header() {
  return (
    <div className={styles.headerStuff}>
      <h1>MeMoDeck</h1>
      <img className={styles.studyGuy} src="../src/assets/images/studyGuy.png" />
    </div>
  );
}

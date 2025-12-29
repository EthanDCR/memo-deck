import styles from './fileSelectionPage.module.css';

interface FileSelectionPageProps {
  onSelectFiles: () => void;
}

export default function FileSelectionPage({ onSelectFiles }: FileSelectionPageProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Create New Deck</h2>
      <p className={styles.pageSubtitle}>Select your study materials to generate flashcards</p>

      <ul className={styles.fileTypesList}>
        <li><strong>Supported File Types: </strong></li>
        <li>.png</li>
        <li>.jpg</li>
        <li>.txt</li>
        <li>.pdf</li>
      </ul>
      <button onClick={onSelectFiles}>Select Files</button>
    </div>
  );
}

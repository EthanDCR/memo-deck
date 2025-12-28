import styles from './fileSelectionPage.module.css';

interface FileSelectionPageProps {
  onSelectFiles: () => void;
}

export default function FileSelectionPage({ onSelectFiles }: FileSelectionPageProps) {
  return (
    <>
      <ul className={styles.fileTypesList}>
        <li><strong>Supported File Types: </strong></li>
        <li>.png</li>
        <li>.jpg</li>
        <li>.txt</li>
        <li>.pdf</li>
      </ul>
      <button onClick={onSelectFiles}>Select Files</button>
    </>
  );
}

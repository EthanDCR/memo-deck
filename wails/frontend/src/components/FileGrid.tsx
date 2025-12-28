import styles from './fileGrid.module.css';
import { extractFileName } from '../utils/fileUtils';

interface FileGridProps {
  files: string[];
}

export default function FileGrid({ files }: FileGridProps) {
  return (
    <div className={styles.selectedFilesMap}>
      <div className={styles.sectionHeader}>Selected Files</div>
      <div className={styles.filesGrid}>
        {files.map((file, i) => (
          <div key={i}>{extractFileName(file)}</div>
        ))}
      </div>
    </div>
  );
}

import styles from './deckCreationPage.module.css';
import FileGrid from '../components/FileGrid';
import Counter from '../components/Counter';


interface DeckCreationPageProps {
  files: string[];
  deckName: string;
  notes: string;
  count: number;
  onDeckNameChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onCountChange: (operator: string) => void;
  onSubmit: () => void;
}

export default function DeckCreationPage({
  files,
  deckName,
  notes,
  count,
  onDeckNameChange,
  onNotesChange,
  onCountChange,
  onSubmit
}: DeckCreationPageProps) {

  return (
    <div className={styles.page}>
      <FileGrid files={files} />
      <div className={styles.contextSection}>
        <div className={styles.deckNameInput}>
          <div className={styles.sectionHeader}>Deck Name</div>
          <textarea
            className={styles.deckNameTextArea}
            placeholder="e.g. Biology Midterm - Chapter 5"
            onChange={(e) => onDeckNameChange(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.notesInput}>
          <div className={styles.sectionHeader}>Context (Optional)</div>
          <textarea
            className={styles.notesTextArea}
            placeholder="e.g. I have a midterm on Friday about these PDFs. Generate cards that focus on definitions and historical dates, and skip the introductory sections."
            onChange={(e) => onNotesChange(e.target.value)}
            rows={15}
            cols={80}
          ></textarea>
        </div>
        <div className={styles.submitContainer}>
          <Counter value={count} onCount={onCountChange} />
          <button onClick={onSubmit} className={styles.contextBtn}>Submit Context</button>
        </div>
      </div>
    </div>
  );
}

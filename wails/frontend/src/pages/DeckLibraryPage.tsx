import DeckView from '../components/DeckView';
import styles from './deckLibraryPage.module.css';

export default function DeckLibraryPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>My Decks</h2>
      <p className={styles.pageSubtitle}>Select a deck to begin studying</p>
      <DeckView />
    </div>
  );
}

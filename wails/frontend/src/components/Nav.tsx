import styles from './nav.module.css';
import { ViewType } from '../types';

interface NavProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export default function Nav({ currentView, onNavigate }: NavProps) {
  return (
    <nav className={styles.nav}>
      <button
        className={currentView === 'file-selection' ? styles.active : ''}
        onClick={() => onNavigate('file-selection')}
      >
        Create Deck
      </button>
      <button
        className={currentView === 'deck-library' ? styles.active : ''}
        onClick={() => onNavigate('deck-library')}
      >
        My Decks
      </button>
    </nav>
  );
}

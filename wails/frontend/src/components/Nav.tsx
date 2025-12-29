import { NavLink } from 'react-router-dom';
import styles from './nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? styles.active : ''}
      >
        Create Deck
      </NavLink>
      <NavLink
        to="/library"
        className={({ isActive }) => isActive ? styles.active : ''}
      >
        My Decks
      </NavLink>
    </nav>
  );
}

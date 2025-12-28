import styles from './counter.module.css';

interface CounterProps {
  value: number;
  onCount: (operator: string) => void;
}

export default function Counter({ value, onCount }: CounterProps) {
  return (
    <div className={styles.counter}>
      <button onClick={() => onCount("-")}>🡸</button>
      <p>{value}</p>
      <button onClick={() => onCount("+")}>🡺</button>
    </div>
  );
}

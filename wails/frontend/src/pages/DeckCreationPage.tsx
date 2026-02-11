import styles from './deckCreationPage.module.css';
import FileGrid from '../components/FileGrid';
import Counter from '../components/Counter';
import altman from '../assets/images/altman.jpg'
import { useEffect, useState } from 'react';
import { CheckKey, RevertModel, SaveKey } from '../../wailsjs/go/main/App';

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
  const [showAltman, setShowAltman] = useState<boolean>(false);
  const [key, setKey] = useState<string>("")
  const [hasKey, setHasKey] = useState<boolean>(false)
  const [provider, setProvider] = useState<string>("")

  useEffect(() => {
    findKey()
  }, [])

  const findKey = async () => {
    const res = await CheckKey()
    console.log(`res to findKey: ${res}`)
    if (res == true) {
      setHasKey(true)
    }
  }

  const saveKey = async () => {
    const res = await SaveKey(key, provider)
    console.log(`saveKey res: ${res}`)
    if (res == "success") {
      setHasKey(true)
    }
  }

  const revertModel = async () => {
    console.log(`attempting to remove private key and revert model`)
    const res = await RevertModel()
    console.log(res)
    if (res == "removed") {
      setHasKey(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.mainLayout}>
        <div className={styles.leftColumn}>
          <div className={styles.leftContainer}>
            <FileGrid files={files} />

            <div className={styles.deckNameInput}>
              <div className={styles.sectionHeader}>Deck Name</div>
              <textarea
                className={styles.deckNameTextArea}
                placeholder="e.g. Biology Midterm - Chapter 5"
                onChange={(e) => onDeckNameChange(e.target.value)}
              ></textarea>
            </div>

            <div className={styles.submitContainer}>
              <Counter value={count} onCount={onCountChange} />
              <button onClick={onSubmit} className={styles.contextBtn}>Generate cards</button>
            </div>
          </div>


          {!hasKey ?
            <div className={styles.apiKeySection}>
              <h3>Use a third party API for faster generation times</h3>

              <label>Select your api provider:</label>
              <select onChange={(e) => setProvider(e.target.value)}>
                <option>OpenAi</option>
                <option>openrouter</option>
              </select>

              <div className={styles.apiKeyInput}>
                <input onChange={(e) => setKey(e.target.value)} type="text" placeholder="Enter API key here" />
              </div>

              <button onClick={() => saveKey()}>Save Key</button>
              <p className={styles.apiKeyNote}>
                Note: Your key will be stored on your local machine under .config/memoDeck/keys.json
                <br />
                This key will never be sent anywhere or leave your machine
              </p>
            </div>
            :
            <div className={styles.apiKeySection}>
              <h3>You are currently using a third party llm for card generation</h3>
              <div className={styles.apiKeyInput}>
                <button onClick={() => revertModel()}>Return to local model</button>
              </div>
              <p className={styles.apiKeyNote}>
                Click here to  remove you private key and revert to the local model.
              </p>
            </div>
          }

        </div>

        <div className={styles.rightColumn}>
          <div className={styles.notesInput}>
            <div className={styles.sectionHeader}>Context (Optional)</div>
            <textarea
              className={styles.notesTextArea}
              placeholder="e.g. I have a midterm on Friday about these PDFs. Generate cards that focus on definitions and historical dates, and skip the introductory sections."
              onChange={(e) => onNotesChange(e.target.value)}
              rows={10}
              cols={80}
            ></textarea>
          </div>
        </div>

      </div>

      {showAltman &&
        <img src={altman} alt="altman" style={{ width: '500px', marginTop: '1rem' }} />
      }

    </div>
  );
}

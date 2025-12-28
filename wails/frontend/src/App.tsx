import { useState } from "react"
import styles from "./app.module.css"
import { GetFilePaths } from "../wailsjs/go/main/App"
import { SendContext } from "../wailsjs/go/main/App"


function App() {

  const [showNotesBox, setShowNotesBox] = useState<boolean>(false)
  const [notes, setNotes] = useState<string>("")
  const [files, setFiles] = useState<string[]>([])
  const [showSelectFiles, setShowSelectFiles] = useState<boolean>(true)
  const [count, setCount] = useState<number>(10)
  const [deckName, setDeckName] = useState<string>("")

  const getFiles = async () => {
    try {
      const fileArray = await GetFilePaths()
      const systemFiles = [];
      for (let i = 0; i < fileArray.length; i++) {
        systemFiles.push(fileArray[i])
        console.log("file recived: \n" + systemFiles[i])
      }
      setShowNotesBox(true);
      setFiles(systemFiles)
      if (systemFiles.length != 0) {
        setShowSelectFiles(false)
        setShowNotesBox(true)
      }
    }
    catch (error) {
      console.error(error, "error getting files")
    }
  }

  const handleCount = (operator: string) => {
    switch (operator) {
      case "+":
        if (count >= 50) {
          break;
        }
        setCount(count + 1)
        break;

      case "-":
        if (count <= 0) {
          break;
        }
        setCount(count - 1)
        break;
    }
  }

  interface Context {
    name: string,
    files: string[],
    notes: string | "",
    count: number,
  }

  interface Card {
    front: string,
    back: string,
  }

  interface Deck {
    id: string,
    cards: Card[],
  }

  const handleSubmit = () => {
    const context: Context = {
      name: deckName,
      files: files,
      notes: notes,
      count: count,
    }

    SendContext(context)
    console.log("made context object, object: \n" + context.notes, context.files, context.count)
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerStuff}>
        <h1>MeMoDeck</h1>
        <img className={styles.studyGuy} src="../src/assets/images/studyGuy.png" />
      </div>
      {files.length <= 0 ?
        <ul>
          <li><strong>Supported File Types: </strong></li>
          <li>.png</li>
          <li>.jpg</li>
          <li>.txt</li>
          <li>.pdf</li>
        </ul>
        :
        <div className={styles.selectedFilesMap}>
          <div className={styles.sectionHeader}>Selected Files</div>
          <div className={styles.filesGrid}>
            {files.map((file, i) => {
              const parts = file.split("/")
              const final = parts.pop() || file
              return <div key={i}>{final}</div>
            })}
          </div>
        </div>
      }

      <div>
        {showSelectFiles &&
          <button onClick={() => getFiles()}>Select Files</button>
        }

        {showNotesBox &&

          <div className={styles.contextSection}>
            <div className={styles.deckNameInput}>
              <div className={styles.sectionHeader}>Deck Name</div>
              <textarea
                className={styles.deckNameTextArea}
                placeholder="e.g. Biology Midterm - Chapter 5"
                onChange={(e) => setDeckName(e.target.value)}
              ></textarea>
            </div>
            <div className={styles.sectionHeader}>Context (Optional)</div>
            <textarea className={styles.notesTextArea} placeholder="e.g. I have a midterm on Friday about these PDFs. Generate cards that focus on definitions and historical dates, and skip the introductory sections."
              onChange={(e) => setNotes(e.target.value)} rows={15} cols={80}></textarea>
            <div className={styles.submitContainer}>
              <div className={styles.counter}>
                <button onClick={() => handleCount("-")}>🡸</button>
                <p>{count}</p>
                <button onClick={() => handleCount("+")}>🡺</button>
              </div>
              <button onClick={() => handleSubmit()} className={styles.contextBtn}>Submit Context</button>
            </div>
          </div>}

      </div>
    </div>
  )
}

export default App

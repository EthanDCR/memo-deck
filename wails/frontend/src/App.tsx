import { useEffect, useState } from "react"
import styles from "./app.module.css"
import { GetFilePaths } from "../wailsjs/go/main/App"



function App() {

  const [showNotesBox, setShowNotesBox] = useState<boolean>(false)
  const [notes, setNotes] = useState<string | null>(null)
  const [files, setFiles] = useState<string[]>([])
  const [showSelectFiles, setShowSelectFiles] = useState<boolean>(true)
  const [count, setCount] = useState<number>(30)


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
      case "-":
        if (count <= 0) {
          break;
        } else {
          setCount(count - 1)
          break;
        }
      case "+":
        if (count >= 100) {
          break;
        } else {
          setCount(count + 1)
          break;
        }
    }
  }



  return (
    <div className={styles.page}>
      <h1>MeMoDeck</h1>
      {files.length <= 0 ?
        <ul>
          <li><strong>Supported File Types: </strong></li>
          <li>.png</li>
          <li>.jpg</li>
          <li>.txt</li>
          <li>.pdf</li>
        </ul>
        :
        <div>
          <p>Selected files: </p>
          <div className={styles.selectedFilesMap}>
            {files.map((file, i) => {
              const parts = file.split("/")
              const final = parts.pop() || file
              return <div key={i}>- {final}</div>
            })}
          </div>
        </div>
      }

      <div>
        {showSelectFiles &&
          <button onClick={() => getFiles()}>Select Files</button>
        }

        {showNotesBox &&
          <div>
            <h3>Optional - Provide some context to the LLM </h3>
            <textarea placeholder=" eg. I have a midterm on Friday about these PDFs. Generate cards that focus on
            definitions and historical dates, and skip the introductory sections."
              onChange={(e) => setNotes(e.target.value)} rows={30} cols={80}></textarea>
            <div className={styles.submitContainer}>
              <div className={styles.counter}>
                <button onClick={() => handleCount("-")}>🡸</button>
                <button onClick={() => handleCount("+")}>🡺</button>
                <p>{count}</p>
              </div>
              <button className={styles.contextBtn}>Submit Context</button>
            </div>
          </div>}

      </div>
    </div>
  )
}

export default App

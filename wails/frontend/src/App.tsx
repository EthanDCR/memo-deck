import { useEffect, useState, useRef } from "react"
import styles from "./app.module.css"
import { GetFilePaths } from "../wailsjs/go/main/App"



function App() {

  const [showNotesBox, setShowNotesBox] = useState<boolean>(false)
  const [notes, setNotes] = useState<string | null>(null)
  const [files, setFiles] = useState<string[]>([])
  const [showSelectFiles, setShowSelectFiles] = useState<boolean>(true)
  const [count, setCount] = useState<number>(30)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)


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
    setCount(prevCount => {
      if (operator === "-") {
        return prevCount <= 10 ? 10 : prevCount - 1
      } else {
        return prevCount >= 100 ? 100 : prevCount + 1
      }
    })
  }

  const handleMouseDown = (operator: string) => {
    handleCount(operator)
    intervalRef.current = setInterval(() => {
      handleCount(operator)
    }, 100)
  }

  const handleMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])



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
            <div className={styles.sectionHeader}>Context (Optional)</div>
            <textarea placeholder="e.g. I have a midterm on Friday about these PDFs. Generate cards that focus on definitions and historical dates, and skip the introductory sections."
              onChange={(e) => setNotes(e.target.value)} rows={20} cols={80}></textarea>
            <div className={styles.submitContainer}>
              <div className={styles.counter}>
                <button
                  onMouseDown={() => handleMouseDown("-")}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={() => handleMouseDown("-")}
                  onTouchEnd={handleMouseUp}
                >🡸</button>
                <p>{count}</p>
                <button
                  onMouseDown={() => handleMouseDown("+")}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={() => handleMouseDown("+")}
                  onTouchEnd={handleMouseUp}
                >🡺</button>
              </div>
              <button className={styles.contextBtn}>Submit Context</button>
            </div>
          </div>}

      </div>
    </div>
  )
}

export default App

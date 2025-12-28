import { useEffect, useState } from "react"
import styles from "../components/deckView.module.css"
import { GetFileNames } from "../../wailsjs/go/main/App"



export default function DeckView() {

  const [fileNames, setFileNames] = useState<string[]>([])
  const [showFileNames, setShowFileNames] = useState<boolean>(false)



  useEffect(() => {
    const getFiles = async () => {
      const res = await GetFileNames()
      setFileNames(res)
      setShowFileNames(true)
      console.log(res)
    }
    getFiles()
  }, []);

  return (
    <div className={styles.page}>
      {showFileNames &&
        fileNames.slice(-9).map((name, i) => (
          <div className={styles.fileNames} key={i}>
            <button key={i}>Open {name}</button>
          </div>
        ))
      }

    </div>
  )
}

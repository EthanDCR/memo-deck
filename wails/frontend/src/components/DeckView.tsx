import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../components/deckView.module.css"
import { GetFileNames } from "../../wailsjs/go/main/App"

export default function DeckView() {
  const [fileNames, setFileNames] = useState<string[]>([])
  const [showFileNames, setShowFileNames] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getFiles = async () => {
      const res = await GetFileNames()
      setFileNames(res)
      setShowFileNames(true)
    }
    getFiles()
  }, []);

  const handleClick = (fileName: string) => {
    navigate(`/study/${fileName}`)
  }

  return (
    <div className={styles.page}>
      {showFileNames &&
        fileNames.slice(-9).map((name, index) => (
          <div key={index} className={styles.fileNames}>
            <button key={index} onClick={() => handleClick(name)} > {name.replace(/-/g, " ")}</button>
          </div>
        ))
      }
    </div>
  )
}

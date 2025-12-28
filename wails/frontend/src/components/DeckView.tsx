import { useEffect, useState } from "react"
import styles from "../components/deckView.module.css"
import { GetFileNames } from "../../wailsjs/go/main/App"
import { GetDeck } from "../../wailsjs/go/main/App"


export default function DeckView() {

  const [fileNames, setFileNames] = useState<string[]>([])
  const [showFileNames, setShowFileNames] = useState<boolean>(false)



  useEffect(() => {
    const getFiles = async () => {
      const res = await GetFileNames()
      setFileNames(res)
      setShowFileNames(true)
    }
    getFiles()
  }, []);


  const handleClick = async (fileName: string) => {
    const res = await GetDeck(fileName)
    console.log(res.name)
    console.log(res.flashCards)
  }

  return (
    <div className={styles.page}>
      {showFileNames &&
        fileNames.slice(-9).map((name, index) => (
          <div key={index} className={styles.fileNames}>
            <button key={index} onClick={() => handleClick(name)} >Study {name}</button>
          </div>
        ))
      }

    </div>
  )
}

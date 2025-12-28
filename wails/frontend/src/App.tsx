import { useState, useEffect } from "react"
import styles from "./app.module.css"
import { GetFilePaths, SendContext } from "../wailsjs/go/main/App"
import { ViewType } from "./types"
import Header from "./components/Header"
import Nav from "./components/Nav"
import FileSelectionPage from "./pages/FileSelectionPage"
import DeckCreationPage from "./pages/DeckCreationPage"
import DeckLibraryPage from "./pages/DeckLibraryPage"

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('file-selection')
  const [notes, setNotes] = useState<string>("")
  const [files, setFiles] = useState<string[]>([])
  const [count, setCount] = useState<number>(10)
  const [deckName, setDeckName] = useState<string>("")

  interface Context {
    name: string,
    files: string[],
    notes: string | "",
    count: number,
  }

  useEffect(() => {
    if (files.length > 0 && currentView === 'file-selection') {
      setCurrentView('deck-creation')
    }
  }, [files, currentView])

  const getFiles = async () => {
    try {
      const fileArray = await GetFilePaths()
      const systemFiles = [];
      for (let i = 0; i < fileArray.length; i++) {
        systemFiles.push(fileArray[i])
        console.log("file recived: \n" + systemFiles[i])
      }
      setFiles(systemFiles)
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
      <Header />
      <Nav currentView={currentView} onNavigate={setCurrentView} />
      {currentView === 'file-selection' && (
        <FileSelectionPage onSelectFiles={getFiles} />
      )}

      {currentView === 'deck-creation' && (
        <DeckCreationPage
          files={files}
          deckName={deckName}
          notes={notes}
          count={count}
          onDeckNameChange={setDeckName}
          onNotesChange={setNotes}
          onCountChange={handleCount}
          onSubmit={handleSubmit}
        />
      )}

      {currentView === 'deck-library' && (
        <DeckLibraryPage />
      )}
    </div>
  )
}

export default App

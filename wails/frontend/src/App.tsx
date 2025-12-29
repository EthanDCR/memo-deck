import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import styles from "./app.module.css"
import { GetFilePaths, SendContext } from "../wailsjs/go/main/App"
import Header from "./components/Header"
import Nav from "./components/Nav"
import FileSelectionPage from "./pages/FileSelectionPage"
import DeckCreationPage from "./pages/DeckCreationPage"
import DeckLibraryPage from "./pages/DeckLibraryPage"
import StudyPage from "./pages/StudyPage"
import DeckLoading from "./components/DeckLoading"

function AppContent() {
  const [notes, setNotes] = useState<string>("")
  const [files, setFiles] = useState<string[]>([])
  const [count, setCount] = useState<number>(10)
  const [deckName, setDeckName] = useState<string>("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)

  interface Context {
    name: string,
    files: string[],
    notes: string | "",
    count: number,
  }

  useEffect(() => {
    if (files.length > 0) {
      navigate('/create')
    }
  }, [files, navigate])

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


  const handleSubmit = async () => {
    const context: Context = {
      name: deckName,
      files: files,
      notes: notes,
      count: count,
    }

    setLoading(true)
    try {
      await SendContext(context)
    } catch (error) {
      console.error(error, "error sending context")
    } finally {
      setLoading(false)
    }

    console.log("made context object, object: \n" + context.notes, context.files, context.count)
  }

  if (!loading) {
    return (
      <div className={styles.page}>
        <Header />
        <Nav />
        <Routes>
          <Route path="/" element={<FileSelectionPage onSelectFiles={getFiles} />} />
          <Route path="/create" element={
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
          } />
          <Route path="/library" element={<DeckLibraryPage />} />
          <Route path="/study/:deckName" element={<StudyPage />} />
        </Routes>
      </div>
    )
  } else {
    return (
      <div className={styles.page}>
        <Header />
        <DeckLoading deckName={deckName} />
      </div>
    )
  }
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

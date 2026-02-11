import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import styles from "./app.module.css"
import { GetFilePaths, SendContext } from "../wailsjs/go/main/App"
import CardNav from "./components/CardNav"
import FileSelectionPage from "./pages/FileSelectionPage"
import DeckCreationPage from "./pages/DeckCreationPage"
import DeckLibraryPage from "./pages/DeckLibraryPage"
import StudyPage from "./pages/StudyPage"
import DeckLoading from "./components/DeckLoading"
import studyGuyLogo from "./assets/images/studyGuy.png"




function AppContent() {
  const [notes, setNotes] = useState<string>("")
  const [files, setFiles] = useState<string[]>([])
  const [count, setCount] = useState<number>(30)
  const [deckName, setDeckName] = useState<string>("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [deckCreated, setDeckCreated] = useState<boolean>(false)
  const [showNameTooLongMessage, setNameTooLongMessage] = useState<boolean>(false)


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
        if (count <= 5) {
          break;
        }
        setCount(count - 1)
        break;
    }
  }


  const nameTooLong = () => {
    setNameTooLongMessage(true)
    setTimeout(() => {
      setNameTooLongMessage(false)
    }, 5000)
  }



  const handleSubmit = async () => {
    if (deckName.length > 25 || deckName.length < 5) {
      nameTooLong()
      return
    }

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
      setDeckCreated(true)
      setLoading(false)
    }

    console.log("made context object, object: \n" + context.notes, context.files, context.count)
  }

  if (deckCreated) {
    return (
      <div className={styles.successContainer}>
        <h2>Successfully generated cards for {deckName} :) </h2>

        <div className={styles.createdButtons}>
          <button onClick={() => {
            setDeckCreated(false)
            navigate(`/study/${deckName}`)
          }}>Go study {deckName} </button>
          <button onClick={() => {
            setDeckCreated(false)
            navigate('/')
          }}>Back to library</button>
          <button onClick={() => {
            setDeckCreated(false)
            navigate('/create')
          }}>Create another deck</button>
        </div>

      </div>
    )
  }

  else if (loading) {
    return (
      <div className={styles.page}>
        <DeckLoading deckName={deckName} />
      </div>
    )
  }

  else {
    return (
      <div className={styles.page}>
        <CardNav
          logo={studyGuyLogo}
          logoAlt="MeMoDeck"
          baseColor="#1a1625"
          menuColor="#b8a5d0"
          buttonBgColor="#a855f7"
          buttonTextColor="#fff"
          items={[
            {
              label: "Create Deck",
              bgColor: "#a855f7",
              textColor: "#fff",
              links: [
                { label: "New Deck", href: "/", ariaLabel: "Create a new deck" }
              ]
            },
            {
              label: "My Decks",
              bgColor: "#ec4899",
              textColor: "#fff",
              links: [
                { label: "View Library", href: "/library", ariaLabel: "View your deck library" }
              ]
            }
          ]}
        />

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



        <div className={styles.errorMessages}>
          {showNameTooLongMessage &&
            <p>Error - <br /> Deck name must be between 5 and 25 characters <br /> Current length - {deckName.length}</p>
          }
        </div>



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

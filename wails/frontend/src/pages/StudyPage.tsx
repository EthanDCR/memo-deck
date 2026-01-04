import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GetDeck } from "../../wailsjs/go/main/App"
import styles from "../pages/studypage.module.css"
import { UpdateState } from "../../wailsjs/go/main/App"

type Side = 'question' | 'answer'
type BtnInput = 'again' | 'hard' | 'good' | 'easy'

interface ClientObject {
  deckId: string,
  cardId: string,
  action: string,
}

export default function StudyPage() {
  const { deckName } = useParams()
  const [deck, setDeck] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [cardIndex, setCardIndex] = useState<number>(0)
  const [cardSide, setCardSide] = useState<Side>('question')
  const [deckNameTrimmed, setDeckNameTrimmed] = useState<any>("")

  useEffect(() => {
    setDeckNameTrimmed(deckName?.replace(/-/g, "  "))
  }, []);

  useEffect(() => {
    const loadDeck = async () => {
      if (deckName) {
        const deck = await GetDeck(deckName)
        setDeck(deck)
        setLoading(false)
        console.log("Loaded deck:", deck.name, deck.flashCards, deck.ID, deck.Created_at)
      }
    }
    loadDeck()
  }, [deckName])

  if (loading) {
    return <div>Loading deck {deckName}...</div>
  }


  const handleNext = (btnInput: BtnInput) => {

    if (cardIndex >= deck.flashCards.length - 1) {
      setCardIndex(0)
      setCardSide('question')
      return
    } else {
      setCardIndex(cardIndex + 1)
      setCardSide('question')
    }

    const data: ClientObject = {
      deckId: deck.ID,
      cardId: deck.flashCards[cardIndex].id,
      action: btnInput,
    }
    const jsonData = JSON.stringify(data)
    UpdateState(jsonData)
  }


  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Studying: {deckNameTrimmed}</h2>
        <p>Cards: {deck?.flashCards?.length || 0}</p>
      </div>

      {!loading && (
        <div className={styles.card}>
          <h2>{cardSide.toUpperCase()} #{cardIndex + 1}: <br /><br /> {deck?.flashCards?.[cardIndex]?.[cardSide]} </h2>
          {(cardSide === 'question' ? <button onClick={() => setCardSide('answer')}>Reveal answer</button> :
            <div className={styles.inputBtns}>
              <button onClick={() => handleNext("again")}>Again 🔁 </button>
              <button onClick={() => handleNext("hard")}>Hard 😬 </button>
              <button onClick={() => handleNext("good")}>Good ✅ </button>
              <button onClick={() => handleNext("easy")}>Easy 😎</button>
            </div>
          )}
        </div>
      )
      }

    </div >

  )
}




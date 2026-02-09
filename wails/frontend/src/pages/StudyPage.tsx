import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { main } from "../../wailsjs/go/models"
import { EditCard, GetDeck } from "../../wailsjs/go/main/App"
import styles from "../pages/studypage.module.css"
import { UpdateState } from "../../wailsjs/go/main/App"

type Side = 'question' | 'answer'
type BtnInput = 'again' | 'hard' | 'good' | 'easy'

interface ClientObject {
  deckId: string,
  cardId: string,
  action: string,
  points: number,
  index: number,
}

export default function StudyPage() {
  const { deckName } = useParams()
  const [deck, setDeck] = useState<main.Deck>()
  const [loading, setLoading] = useState(true)
  const [cardIndex, setCardIndex] = useState<number>(0)
  const [cardSide, setCardSide] = useState<Side>('question')
  const [deckNameTrimmed, setDeckNameTrimmed] = useState<any>("")
  const [cardEditMode, setCardEditMode] = useState<boolean>(false)
  const [editedCardValue, setEditedCardValue] = useState<string>("")

  useEffect(() => {
    setDeckNameTrimmed(deckName?.replace(/-/g, "  "))
  }, []);

  const loadDeck = async () => {
    if (deckName) {
      const deck = await GetDeck(deckName)
      setDeck(deck)
      console.log(deck)
      setLoading(false)
      console.log("Loaded deck:", deck.name, deck.flashCards, deck.ID, deck.Created_at)
    }
  }

  useEffect(() => {
    loadDeck()
  }, [deckName])

  if (loading || !deck) {
    return <div>Loading deck {deckName}...</div>
  }

  const handleNext = (btnInput: BtnInput) => {

    let points = 0
    switch (btnInput) {
      case "again":
        points = 0
        break
      case "hard":
        points = 5
        break
      case "good":
        points = 10
        break
      case "easy":
        points = 20
        break
    }

    const data: ClientObject = {
      deckId: deck.name,
      cardId: deck.flashCards[cardIndex].id,
      action: btnInput,
      points: points,
      index: cardIndex,
    }
    const jsonData = JSON.stringify(data)
    console.log(`btn input: ${btnInput}`)
    UpdateState(jsonData)

    if (cardIndex >= deck.flashCards.length - 1) {
      setCardIndex(0)
      setCardSide('question')
    } else {
      setCardIndex(cardIndex + 1)
      setCardSide('question')
    }
  }

  const handleEdit = () => {
    setCardEditMode((prev) => !prev)
  }

  const submitEdit = async () => {
    console.log("current card side: " + cardSide)
    const testing = await EditCard(deck?.name, deck?.flashCards[cardIndex]?.id, cardSide, editedCardValue)
    console.log(testing)
    setCardEditMode((prev) => !prev)
    await loadDeck()
  }

  const reset = () => {
    setCardIndex(0)
    setCardSide("question")
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headNstudy}><h2>Studying: {deckNameTrimmed}</h2><button onClick={reset}>Reset 🔄</button></div>
        <p>Cards: {deck?.flashCards?.length || 0}</p>
      </div>

      {!loading && (
        <div className={styles.card}>
          <h2>{cardSide.toUpperCase()} #{cardIndex + 1}: <br /><br /> {deck?.flashCards?.[cardIndex]?.[cardSide]} </h2>
          {(cardSide === 'question' ? <button className={styles.answerBtn} onClick={() => setCardSide('answer')}>Reveal answer</button> :
            <div className={styles.inputBtns}>
              <button onClick={() => handleNext("again")}>Again 🔁 </button>
              <button onClick={() => handleNext("hard")}>Hard 😬 </button>
              <button onClick={() => handleNext("good")}>Good ✅ </button>
              <button onClick={() => handleNext("easy")}>Easy 😎</button>
            </div>
          )}

          {!cardEditMode ? (
            <div className={styles.editBtn}>
              <button onClick={handleEdit}>Edit this Card</button> </div>
          ) : (
            <div className={styles.editBtn}>
              <textarea onChange={(e) => setEditedCardValue(e.target.value)} placeholder="Enter text to replace current"></textarea>
              <div>
                <button onClick={() => submitEdit()}>Save changes</button>
                <button onClick={handleEdit}>Discard</button>
              </div>

            </div>
          )}
        </div>
      )
      }

    </div >

  )
}




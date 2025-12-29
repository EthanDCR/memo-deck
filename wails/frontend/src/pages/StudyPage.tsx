import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GetDeck } from "../../wailsjs/go/main/App"
import styles from "../pages/studypage.module.css"

type Side = 'question' | 'answer'

export default function StudyPage() {
  const { deckName } = useParams()
  const [deck, setDeck] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  //card state
  const [cardIndex, setCardIndex] = useState<number>(0)
  const [cardSide, setCardSide] = useState<Side>('question')

  useEffect(() => {
    const loadDeck = async () => {
      if (deckName) {
        const deck = await GetDeck(deckName)
        setDeck(deck)
        setLoading(false)
        console.log("Loaded deck:", deck.name, deck.flashCards)
      }
    }
    loadDeck()
  }, [deckName])

  if (loading) {
    return <div>Loading deck...</div>
  }

  //state to control index
  //no map, just show deck[0]?.front and then button calls function moves to deck at i to back -> deck[0]?.back
  // then button -> function that changes state of deck to i + 1 .front


  const handleNext = () => {
    if (cardIndex >= deck.flashCards.length - 1) {
      setCardIndex(0)
      setCardSide('question')
      return
    } else {
      setCardIndex(cardIndex + 1)
      setCardSide('question')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Studying: {deck?.name}</h2>
        <p>Cards: {deck?.flashCards?.length || 0}</p>
      </div>

      {!loading && (
        <div className={styles.card}>
          <h2>{cardSide.toUpperCase()} #{cardIndex + 1}: <br /><br /> {deck?.flashCards?.[cardIndex]?.[cardSide]} </h2>
          {(cardSide === 'question' ? <button onClick={() => setCardSide('answer')}>Reveal answer</button> :
            <button onClick={handleNext}>Next card</button>)}
        </div>
      )
      }

    </div >

  )
}




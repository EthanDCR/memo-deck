import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GetDeck } from "../../wailsjs/go/main/App"

type Side = 'front' | 'back'

export default function StudyPage() {
  const { deckName } = useParams()
  const [deck, setDeck] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  //card state
  const [cardIndex, setCardIndex] = useState<number>(0)
  const [cardSide, setCardSide] = useState<Side>('front')

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

  return (
    <div>
      <div>
        <h2>Studying: {deck?.name}</h2>
        <p>Flashcards: {deck?.flashCards?.length || 0}</p>
      </div>

      <div>
        {!loading &&
          <div>{deck?.flashCards?.[cardIndex]?.[cardSide]}</div>
        }

      </div>

    </div>

  )
}




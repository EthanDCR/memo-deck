import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GetDeck } from "../../wailsjs/go/main/App"

export default function StudyPage() {
  const { deckName } = useParams()
  const [deck, setDeck] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div>
      <div>
        <h2>Studying: {deck?.name}</h2>
        <p>Flashcards: {deck?.flashCards?.length || 0}</p>
      </div>


      <div>
        {!loading && deck?.flashCards?.map((card: any, i: number) => (
          <div key={i}>
            <div>front: {card.front}</div>
            <div>back: {card.back}</div>
          </div>
        ))}
      </div>


    </div>

  )
}




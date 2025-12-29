
import styles from "../components/deckLoading.module.css"
import { RotatingLines } from "react-loader-spinner"
import { useEffect, useState } from "react"


interface LoadingMessages {
  heading: string
  text: string
}

const loadingMessages: LoadingMessages[] = [
  {
    "heading": "The Local Trade-off",
    "text": "Generating these flashcards relies entirely on your local hardware. While cloud-based alternatives might be faster, they come with a monthly subscription and data privacy concerns. By running the model directly on your machine, you're that instant speed for a tool that is completely free to use, can run completley offline, and keeps your data exactly where it belongs—on your hard drive."
  },
  {
    "heading": "Math and Hardware",
    "text": "The wait time is determined by your system's processing power. Every card created requires the model to perform millions of mathematical calculations to predict the next word. If you have a dedicated GPU, this usually happens in seconds; on a CPU, the system has to work much harder. It's a heavy lift for any computer, but it's the cost of doing the \"thinking\" locally."
  },
  {
    "heading": "Privacy and Ownership",
    "text": "By processing this deck locally, you aren't sending your personal notes or study materials to a third-party server. Most AI tools use your data to train their future models, but with a local LLM, your information never leaves your device. You have total ownership over the process and the output, ensuring your study sessions stay private and secure."
  }
]

interface DeckLoadingProps {
  deckName: string
}

type MessageCount = 0 | 1 | 2


export default function DeckLoading({
  deckName,
}: DeckLoadingProps) {


  const [messageCount, setMessageCount] = useState<MessageCount>(0)


  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageCount(prev => {
        if (prev == 2) return 0
        return (prev + 1 as MessageCount)
      })
    }, 15000)
    return () => clearInterval(intervalId)
  }, []);

  return (
    <div className={styles.page}>

      <div className={styles.loadHeader}>
        <h1>Generating flashcards for <span className={styles.underlineName}>{deckName}</span></h1>
        {<RotatingLines
          visible={true}
          height="20" width="20"
          color="pink"
          strokeWidth="5"
          animationDuration="1"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />}
      </div>
      <h2>This may take a few minutes</h2>

      <div key={messageCount}>
        <h3>{loadingMessages[messageCount].heading} - </h3>
        <p className={styles.loadingMessageText}>{loadingMessages[messageCount].text}</p>
      </div>
    </div >
  )
}

import { useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { EventsOn } from "../../wailsjs/runtime/runtime"
import { SendStudyBuddyMessage } from "../../wailsjs/go/main/App"
import styles from "../pages/studypage.module.css"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface FlashCard {
  question: string
  answer: string
  [key: string]: any
}

interface StudyBuddyChatProps {
  deckName: string
  currentCard: FlashCard
  cardIndex: number
  cardSide: 'question' | 'answer'
}

export interface StudyBuddyChatRef {
  sendMessage: (message: string) => void
}

const StudyBuddyChat = forwardRef<StudyBuddyChatRef, StudyBuddyChatProps>(
  ({ deckName, currentCard, cardIndex, cardSide }, ref) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const [streamingResponse, setStreamingResponse] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  // Listen for streaming events from backend
  useEffect(() => {
    // Listen for each token as it arrives
    const unsubscribeToken = EventsOn('chat-token', (token: string) => {
      setStreamingResponse(prev => prev + token)
    })

    // Listen for streaming completion
    const unsubscribeDone = EventsOn('chat-done', () => {
      // Use a callback to get the current streamingResponse
      setStreamingResponse(current => {
        if (current) {
          setMessages(prev => [...prev, { role: 'assistant', content: current }])
        }
        setIsStreaming(false)
        return ""
      })
    })

    // Cleanup listeners on unmount
    return () => {
      if (unsubscribeToken) unsubscribeToken()
      if (unsubscribeDone) unsubscribeDone()
    }
  }, [])

  // Shared function to send a message
  const sendMessageToBackend = async (messageContent: string) => {
    if (!messageContent.trim()) return

    // Add user message to state
    const newMessages: Message[] = [...messages, { role: 'user', content: messageContent }]
    setMessages(newMessages)
    setIsStreaming(true)

    // Build context with current card info
    const contextPayload = {
      deckName: deckName,
      currentCard: {
        question: currentCard.question,
        answer: currentCard.answer,
        index: cardIndex + 1,
        side: cardSide
      },
      messages: newMessages
    }

    // Call backend with full conversation history and current card context
    try {
      await SendStudyBuddyMessage(JSON.stringify(contextPayload))
    } catch (error) {
      console.error("Error sending message:", error)
      setIsStreaming(false)
    }
  }

  // Expose sendMessage method to parent via ref
  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => {
      sendMessageToBackend(message)
    }
  }))

  const handleSendMessage = async () => {
    if (!userInput.trim()) return
    await sendMessageToBackend(userInput)
    setUserInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={styles.rightSection}>
      <div className={styles.chatHeader}>
        <h3>Study Buddy</h3>
      </div>

      <div className={styles.chatMessages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}
          >
            {msg.content}
          </div>
        ))}
        {streamingResponse && (
          <div className={`${styles.message} ${styles.botMessage}`}>
            {streamingResponse}
          </div>
        )}
      </div>

      <div className={styles.chatInputContainer}>
        <input
          type="text"
          placeholder="Ask me anything about your study material..."
          className={styles.chatInput}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isStreaming}
        />
        <button
          className={styles.sendBtn}
          onClick={handleSendMessage}
          disabled={isStreaming || !userInput.trim()}
        >
          {isStreaming ? "..." : "Send"}
        </button>
      </div>
    </div>
  )
})

StudyBuddyChat.displayName = 'StudyBuddyChat'

export default StudyBuddyChat

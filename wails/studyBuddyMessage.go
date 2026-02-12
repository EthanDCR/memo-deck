package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
	"github.com/openai/openai-go/shared"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// Frontend (StudyPage.tsx):
// 1. Add state: messages array, userInput string, streamingResponse string
// 2. Add useEffect to listen for 'chat-token' events from backend
// 3. Create handleSendMessage function that adds user msg to state
// 4. Call SendStudyBuddyMessage with deckName and stringified messages
// 5. When streaming starts, append tokens to streamingResponse state
// 6. When streaming ends, add complete response to messages array and clear streamingResponse
// 7. Render messages in chatMessages div with user/bot styling
// 8. Render streamingResponse as temporary bot message while streaming
// 9. Connect input field to userInput state and button to handleSendMessage

// Backend (studyBuddyChat.go):
// 1. Create SendStudyBuddyMessage(deckName string, conversationJSON string)
// 2. Parse conversationJSON into messages array
// 3. Call GetDeck(deckName) to load current deck
// 4. Build context string from deck.flashCards (loop through Q&A)
// 5. Create system message with study buddy prompt + deck context
// 6. Combine system message with conversation history
// 7. Detect config and load API keys (use existing detectConfig logic)
// 8. Create streaming API call to LLM with combined messages
// 9. Loop through stream chunks and emit each token via EventsEmit(a.ctx, "chat-token", token)
// 10. When stream completes, emit EventsEmit(a.ctx, "chat-done", "")
// 11. Return "success" or handle errors

type MessageStream []Message

func (a *App) SendStudyBuddyMessage(deckName string, conversationJSON string) string {
	var stream MessageStream

	err := json.Unmarshal([]byte(conversationJSON), &stream)
	if err != nil {
		fmt.Printf("error unmarshaling conversation: %v\n", err)
		return "error"
	}

	// Now stream contains your messages array
	// stream[0].Role, stream[0].Content, etc.

	status, _ := DetectConfig()

	if status {
		// need to get their key and provider
		configDir, _ := os.UserConfigDir()
		fileName := "keys.json"
		fullFilePath := filepath.Join(configDir, "memoDeck", "keys", fileName)
		configBytes, err := os.ReadFile(fullFilePath)
		if err != nil {
			return fmt.Sprintf("Error reading file bytes for file: %s\n error: %v\n", fullFilePath, err)
		}

		var userConf UserConfig
		err = json.Unmarshal(configBytes, &userConf)
		if err != nil {
			return fmt.Sprintf("error unmarshalling configBytes\n error: %v\n", err)
		}

		switch userConf.Provider {
		case "openrouter":
			//openRouter logic here
		default:
			//openAi logic here
		}

	}

	return ""
}

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

type CurrentCardInfo struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
	Index    int    `json:"index"`
	Side     string `json:"side"`
}

type ChatPayload struct {
	DeckName    string          `json:"deckName"`
	CurrentCard CurrentCardInfo `json:"currentCard"`
	Messages    []Message       `json:"messages"`
}

func (a *App) SendStudyBuddyMessage(payloadJSON string) string {
	var payload ChatPayload

	err := json.Unmarshal([]byte(payloadJSON), &payload)
	if err != nil {
		fmt.Printf("error unmarshaling payload: %v\n", err)
		return "error"
	}

	// Load the deck to get flashcard context
	deck, err := a.GetDeck(payload.DeckName)
	if err != nil {
		fmt.Printf("error loading deck: %v\n", err)
		return "error"
	}

	// Build context string with current card highlighted
	contextStr := fmt.Sprintf(`You are a helpful study buddy. The student is currently viewing card #%d (%s side).

CURRENT CARD (the one they're looking at right now):
Question: %s
Answer: %s

All flashcards in this deck:

`, payload.CurrentCard.Index, payload.CurrentCard.Side, payload.CurrentCard.Question, payload.CurrentCard.Answer)

	for i, card := range deck.FlashCards {
		contextStr += fmt.Sprintf("Card #%d - Q: %s | A: %s\n", i+1, card.Front, card.Back)
	}

	contextStr += "\nWhen the student asks about 'this card', 'question #X', or similar, they're referring to the CURRENT CARD shown above."

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

		// Create client based on provider
		var client openai.Client
		var modelName shared.ChatModel

		if userConf.Provider == "openrouter" {
			client = openai.NewClient(
				option.WithAPIKey(userConf.OpenAIKey),
				option.WithBaseURL("https://openrouter.ai/api/v1"),
			)
			modelName = shared.ChatModel("openai/gpt-oss-120b:free")
		} else {
			client = openai.NewClient(
				option.WithAPIKey(userConf.OpenAIKey),
			)
			modelName = shared.ChatModelGPT4o
		}

		// Build messages array: system message + conversation history
		messages := []openai.ChatCompletionMessageParamUnion{
			// System message with deck context
			{
				OfSystem: &openai.ChatCompletionSystemMessageParam{
					Content: openai.ChatCompletionSystemMessageParamContentUnion{
						OfString: openai.String(contextStr),
					},
				},
			},
		}

		// Add conversation history
		for _, msg := range payload.Messages {
			if msg.Role == "user" {
				messages = append(messages, openai.ChatCompletionMessageParamUnion{
					OfUser: &openai.ChatCompletionUserMessageParam{
						Content: openai.ChatCompletionUserMessageParamContentUnion{
							OfString: openai.String(msg.Content),
						},
					},
				})
			} else if msg.Role == "assistant" {
				messages = append(messages, openai.ChatCompletionMessageParamUnion{
					OfAssistant: &openai.ChatCompletionAssistantMessageParam{
						Content: openai.ChatCompletionAssistantMessageParamContentUnion{
							OfString: openai.String(msg.Content),
						},
					},
				})
			}
		}

		// Create streaming request
		params := openai.ChatCompletionNewParams{
			Model:    modelName,
			Messages: messages,
		}

		// Make streaming call
		stream2 := client.Chat.Completions.NewStreaming(context.TODO(), params)

		// Stream tokens back to frontend
		for stream2.Next() {
			chunk := stream2.Current()
			if len(chunk.Choices) > 0 {
				token := chunk.Choices[0].Delta.Content
				// Emit each token to frontend
				runtime.EventsEmit(a.ctx, "chat-token", token)
			}
		}

		if err := stream2.Err(); err != nil {
			fmt.Printf("error during streaming: %v\n", err)
			return "error"
		}

		// Signal streaming is complete
		runtime.EventsEmit(a.ctx, "chat-done", "")
		return "success"

	} else {
		// Ollama local API
		fmt.Println("Using local Ollama API for study buddy")
		// TODO: Add Ollama streaming implementation if needed
		return "Ollama support not yet implemented for study buddy"
	}
}

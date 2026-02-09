package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

type Deck struct {
	Name       string      `json:"name"`
	Created_at int64       `json:"Created_at"`
	ID         string      `json:"ID"`
	FlashCards []FlashCard `json:"flashCards"`
}

type FlashCard struct {
	Front  string `json:"question"`
	Back   string `json:"answer"`
	ID     string `json:"id"`
	DueAt  int64  `json:"dueAt"`
	Points int    `json:"points"`
}

func extractFlashcards(content string) ([]FlashCard, error) {
	var cards []FlashCard

	err := json.Unmarshal([]byte(content), &cards)
	if err == nil && len(cards) > 0 {
		return cards, nil
	}

	// Strategy 2: Try parsing as generic object and search for flashcard arrays
	var rawData map[string]any
	err = json.Unmarshal([]byte(content), &rawData)
	if err == nil {
		// Look through all fields for arrays that look like flashcards
		for _, value := range rawData {
			if arr, ok := value.([]any); ok {
				// Try to convert this array to flashcards
				jsonBytes, _ := json.Marshal(arr)
				var tempCards []FlashCard
				if json.Unmarshal(jsonBytes, &tempCards) == nil && len(tempCards) > 0 {
					// Verify these are actual flashcards (have question and answer)
					if tempCards[0].Front != "" && tempCards[0].Back != "" {
						return tempCards, nil
					}
				}
			}
		}
	}

	jsonLeft := strings.Index(content, "[")
	jsonRight := strings.LastIndex(content, "]")
	if jsonLeft != -1 && jsonRight != -1 && jsonLeft < jsonRight {
		jsonFinal := content[jsonLeft : jsonRight+1]
		err = json.Unmarshal([]byte(jsonFinal), &cards)
		if err == nil && len(cards) > 0 {
			return cards, nil
		}
	}

	return nil, fmt.Errorf("could not extract valid flashcards from response")
}

func WriteDeck(name string, response ChatResponse) (message string, err error) {

	configPath, err := os.UserConfigDir()
	if err != nil {
		return "could not find config directoy", err
	}

	cards, err := extractFlashcards(response.Message.Content)
	if err != nil {
		return "\n Ai response was not valid json:\n%v\n", err
	}

	for i := range cards {
		cards[i].ID = uuid.NewString()
		cards[i].DueAt = 0
	}

	formattedName := strings.ReplaceAll(strings.TrimSpace(name), " ", "-")

	fmt.Printf("\nformattedName: %s\n", formattedName)

	timeNow := time.Now().Unix()
	newId := uuid.NewString()

	finalDeck := Deck{
		Name:       formattedName,
		ID:         newId,
		Created_at: timeNow,
		FlashCards: cards,
	}

	deckBytes, err := json.MarshalIndent(finalDeck, "", "\t")
	if err != nil {
		return "error converting json into bytes to write to file system", err
	}

	appDataPath := filepath.Join(configPath, "memoDeck")

	err = os.MkdirAll(appDataPath, 0755)
	if err != nil {
		return "error creating new directory", err
	}

	fmt.Printf("new dir made: %s \n", appDataPath)

	finalFilePath := filepath.Join(appDataPath, formattedName+".json")
	err = os.WriteFile(finalFilePath, deckBytes, 0644)
	if err != nil {
		return fmt.Sprintf("error writing file: %s \n ", finalFilePath), err
	}
	return "file created successfuly ", nil
}

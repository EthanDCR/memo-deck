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
	FlashCards []FlashCard `json:"flashCards"`
}

type FlashCard struct {
	Front string `json:"question"`
	Back  string `json:"answer"`
	ID    string `json:"id"`
	DueAt int64  `json:"dueAt"`
}

func WriteDeck(name string, response ChatResponse) (message string, err error) {

	configPath, err := os.UserConfigDir()
	if err != nil {
		return "could not find config directoy", err
	}

	jsonLeft := strings.Index(response.Message.Content, "[")
	jsonRight := strings.LastIndex(response.Message.Content, "]")
	if jsonLeft == -1 || jsonRight == -1 || jsonLeft > jsonRight {
		return "coulnt find valid json in llama response", err
	}

	jsonFinal := response.Message.Content[jsonLeft : jsonRight+1]

	var cards []FlashCard
	err = json.Unmarshal([]byte(jsonFinal), &cards)
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

	finalDeck := Deck{
		Name:       formattedName,
		FlashCards: cards,
		Created_at: timeNow,
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

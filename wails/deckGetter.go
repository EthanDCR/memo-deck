package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func (a *App) GetDeck(deckName string) (deck Deck, err error) {

	configDir, err := os.UserConfigDir()
	if err != nil {
		return Deck{}, err
	}
	fullFileName := fmt.Sprintf("%s%s", deckName, ".json")
	fullFilePath := filepath.Join(configDir, "memoDeck", fullFileName)
	fmt.Printf("full file path : %s", fullFilePath)

	fileContents, err := os.ReadFile(fullFilePath)
	if err != nil {
		return Deck{}, err
	}

	// Deck type here -
	//	Name       string      `json:"name"`
	//	FlashCards []FlashCard `json:"flashCards"`

	err = json.Unmarshal(fileContents, &deck)
	if err != nil {
		return Deck{}, err
	}

	return deck, nil
}

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type Deck struct {
	Name       string      `json:"name"`
	FlashCards []FlashCard `json:"flashCards"`
}

type FlashCard struct {
	Front string `json:"front"`
	Back  string `json:"back"`
}

func WriteDeck(name string, response ChatResponse) {

	configPath, err := os.UserConfigDir()
	if err != nil {
		fmt.Println("Critical: Could not find config directory")
		return
	}

	var cards []FlashCard
	err = json.Unmarshal([]byte(response.Message.Content), &cards)
	if err != nil {
		fmt.Printf("error converting json data into flashcard go objects\n Ai response was not valid json:\n%v\n", err)
	}

	finalDeck := Deck{
		Name:       name,
		FlashCards: cards,
	}

	deckBytes, err := json.MarshalIndent(finalDeck, "", "\t")
	if err != nil {
		fmt.Printf("Error converting json into bytes to write to file system: \n%v\n", err)
	}

	appDataPath := filepath.Join(configPath, "memoDeck")

	err = os.MkdirAll(appDataPath, 0755)
	if err != nil {
		fmt.Printf("error creating directoy")
		return
	}
	finalFilePath := filepath.Join(appDataPath, name+".json")
	err = os.WriteFile(finalFilePath, deckBytes, 0644)
	if err != nil {
		fmt.Printf("error writing file: %s\n%v", finalFilePath, err)
	}
	fmt.Printf("file created: %s\n", finalFilePath)
}

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

//after the stuff below do some type of progress bar and mesure how well
//someone knows their deck

type ClientObject struct {
	DeckName string `json:"deckId"`
	CardId   string `json:"cardId"`
	Action   string `json:"action"`
	Points   int    `json:"points"`
	Index    int    `json:"index"`
}

func (*App) UpdateState(input string) (string, error) {

	var obj ClientObject

	err := json.Unmarshal([]byte(input), &obj)
	if err != nil {
		fmt.Printf("error converting client input into json")
	}

	fmt.Printf("Updating state for %s\n action: %s\n cardId: %s\n", obj.DeckName, obj.Action, obj.CardId)

	configDir, err := os.UserConfigDir()
	if err != nil {
		return fmt.Sprintf("Error: %v/n", err), err
	}

	memo := "memoDeck"
	fullDeckName := fmt.Sprintf("%s.json", obj.DeckName)
	fullFilePath := filepath.Join(configDir, memo, fullDeckName)
	deckBytes, err := os.ReadFile(fullFilePath)
	if err != nil {
		return fmt.Sprintf("Error reading file: %s \n", fullFilePath), err
	}

	fmt.Printf("file found, full filepath: %s \n", fullFilePath)

	var deck = Deck{}
	json.Unmarshal(deckBytes, &deck)
	currentIndex := obj.Index

	var newSlice []FlashCard
	temp := deck.FlashCards[currentIndex]
	temp.Points = obj.Points

	newSlice = deck.FlashCards[:currentIndex]
	newSlice = append(newSlice, deck.FlashCards[currentIndex+1:]...)
	targetIndex := currentIndex + obj.Points

	targetIndex = min(targetIndex, len(newSlice))

	left := newSlice[:targetIndex]
	right := newSlice[targetIndex:]
	var finalSlice []FlashCard
	finalSlice = left
	finalSlice = append(finalSlice, temp)
	finalSlice = append(finalSlice, right...)

	deck.FlashCards = finalSlice

	updatedDeckBytes, err := json.MarshalIndent(deck, "", "  ")
	if err != nil {
		return "Error encoding deck to JSON", err
	}

	err = os.WriteFile(fullFilePath, updatedDeckBytes, 0644)
	if err != nil {
		return "error updating file", err
	}

	fmt.Printf("updated file.")
	return "file updated successfully ", nil
}

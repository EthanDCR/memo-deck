package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"

	"github.com/wailsapp/wails/v2/pkg/menu/keys"
)

//after the stuff below lets do some type of progress bar and mesure how well
//someone knows their deck

type ClientObject struct {
	DeckName string `json:"deckId"`
	CardId   string `json:"cardId"`
	Action   string `json:"action"`
	Index    string `json:"index"`
}

func (*App) UpdateState(input string) (string, error) {

	var obj ClientObject

	err := json.Unmarshal([]byte(input), &obj)
	if err != nil {
		fmt.Printf("error converting client input into json")
	}

	fmt.Printf("Updating state for %s\n action: %s\n cardId: %s\n", obj.DeckName, obj.Action, obj.CardId)

	var action int
	switch obj.Action {
	case "again":
		action = 0
		break
	case "hard":
		action = 2
		break
	case "good":
		action = 5
		break
	case "easy":
		action = 10
		break
	}

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

	currentIndex, err := strconv.Atoi(obj.Index)
	if err != nil {
		return "error converting string from client into int (index): ", err
	}

	var newSlice []FlashCard
	temp := deck.FlashCards[currentIndex]

	newSlice = deck.FlashCards[:currentIndex]
	newSlice = append(newSlice, deck.FlashCards[currentIndex+1:]...)
	indexToInt, err := strconv.Atoi(obj.Index)
	targetIndex := indexToInt + action

	if targetIndex > len(newSlice) {
		targetIndex = len(newSlice)
	}

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

	return "file updated successfully ", nil
}

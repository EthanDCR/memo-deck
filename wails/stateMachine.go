package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

//after the stuff below lets do some type of progress bar and mesure how well
//someone knows their deck
//
//get length of flashcards(deck)
//then basically based on n (the action) move the current card to current
//index + n (action) then load deck client side

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

	// need to loop through deck (the deck from the file on user filesystem)
	// once deck.flashcards.id == obj.cardid then index := i
	var currentIndex int
	for i, card := range deck.FlashCards {
		if card.ID == obj.CardId {
			currentIndex = i
		}
	}

	return "", nil
}

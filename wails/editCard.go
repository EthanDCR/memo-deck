package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func (a *App) EditCard(deckName string, cardId string, newAnswer string) (string, error) {

	fmt.Printf("EditCard called!: we got: \n %v \n %v \n %v \n ", deckName, cardId, newAnswer)

	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	memo := "memoDeck"
	fullDeckName := fmt.Sprintf("%s.json", deckName)
	fullFilePath := filepath.Join(configDir, memo, fullDeckName)

	deckBytes, err := os.ReadFile(fullFilePath)
	if err != nil {
		return fmt.Sprintf("Error reading file: %s \n", fullFilePath), err
	}

	var deck = Deck{}
	json.Unmarshal(deckBytes, &deck)

	found := false
	for i := range deck.FlashCards {
		if deck.FlashCards[i].ID == cardId {
			deck.FlashCards[i].Back = newAnswer
			fmt.Printf("Match found. \n Provided id: %s \n id found: %s", cardId, deck.FlashCards[i].Back)
			found = true
			break
		}
	}

	if !found {
		return fmt.Sprintf("no card with the id: %s found \n", deckName), err
	}

	updatedDeck, err := json.Marshal(deck)
	if err != nil {
		return "", err
	}
	err = os.WriteFile(fullFilePath, updatedDeck, 0644)

	if err != nil {
		return "error writing updated deck to filesystem", err
	}

	return "successfully updated deck", nil
}

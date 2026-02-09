package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func (a *App) ResetProgress(deckName string) string {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "couldn't get user config directory"
	}

	fullDeckName := fmt.Sprintf("%s.json", deckName)
	finalFilePath := filepath.Join(configDir, "memoDeck", fullDeckName)

	deckBytes, err := os.ReadFile(finalFilePath)
	if err != nil {
		return fmt.Sprintf("error reading file: %s\n", finalFilePath)
	}

	deck := Deck{}
	json.Unmarshal(deckBytes, &deck)

	for i := range deck.FlashCards {
		deck.FlashCards[i].Points = 0
	}

	updatedDeckBytes, err := json.MarshalIndent(deck, "", "  ")
	if err != nil {
		return fmt.Sprintf("Error marshalling deck: %v\n", err)
	}

	err = os.WriteFile(finalFilePath, updatedDeckBytes, 0644)
	if err != nil {
		return fmt.Sprintf("Error writing file: %s\n Error: %v\n", finalFilePath, err)
	}

	return ""
}

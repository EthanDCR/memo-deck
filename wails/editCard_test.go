package main

import (
	"testing"
)

func TestEditDeck(t *testing.T) {

	a := &App{}
	deckId := "test-deck"
	cardId := "e9a724d8-6f4a-4d71-a210-883dd25d530f"
	newAnswer := "test text which should be the new answer to test deck with id: \n e9a724d8-6f4a-4d71-a210-883dd25d530f \n"

	result, err := a.EditCard(deckId, cardId, newAnswer)
	if err != nil {
		t.Fatalf("Failed to run EditDeck() \n %v \n", err)
	}
	t.Log(result)
}

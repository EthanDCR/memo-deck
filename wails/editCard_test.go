package main

import (
	"testing"
)

type testCard struct {
	deckName  string
	cardId    string
	cardSide  string
	newAnswer string
}

func TestEditDeck(t *testing.T) {

	a := &App{}

	card := testCard{
		deckName:  "test-deck",
		cardId:    "e9a724d8-6f4a-4d71-a210-883dd25d530f",
		cardSide:  "question",
		newAnswer: "test text which should be the new answer to test deck with id: \n e9a724d8-6f4a-4d71-a210-883dd25d530f \n",
	}

	result, err := a.EditCard(card.deckName, card.cardId, card.cardSide, card.newAnswer)
	if err != nil {
		t.Fatalf("Failed to run EditDeck() \n %v \n", err)
	}
	t.Log(result)
}

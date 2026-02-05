package main

import (
	"encoding/json"
	"fmt"
)

type ClientObject struct {
	Deckid string `json:"deckId"`
	CardId string `json:"cardId"`
	Action string `json:"action"`
}

//after the stuff below lets do some type of progress bar and mesure how well
//someone knows their deck
//
//get length of flashcards(deck)
//then basically based on n (the action) move the current card to current
//index + n (action) then load deck client side

func (*App) UpdateState(input string) {

	var obj ClientObject

	err := json.Unmarshal([]byte(input), &obj)
	if err != nil {
		fmt.Printf("error converting client input into json")
	}
	fmt.Printf("Updating state for %v\n action: %v\n cardId: %v\n", obj.Deckid, obj.Action, obj.CardId)

}

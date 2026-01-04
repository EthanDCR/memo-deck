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

type CurrentValues struct {
	//TODO
	//work on this step next !!!
}

func (*App) UpdateState(input string) {

	var obj ClientObject

	err := json.Unmarshal([]byte(input), &obj)
	if err != nil {
		fmt.Printf("error converting client input into json")
	}
	fmt.Printf("Updating state for %v\n action: %v\n cardId: %v\n", obj.Deckid, obj.Action, obj.CardId)

}

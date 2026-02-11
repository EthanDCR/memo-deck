package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func (a *App) CheckKey() (bool, string) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return false, fmt.Sprintf("Could'nt find user config dir. \n error: %v\n", err)
	}
	fileName := "keys.json"
	fullFilePath := filepath.Join(configDir, "memoDeck", "keys", fileName)
	_, err = os.Stat(fullFilePath)
	if err != nil {
		return false, "keys.json does not exist\n"
	} else {
		return true, "yes"
	}
}

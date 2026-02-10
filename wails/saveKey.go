package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type UserConfig struct {
	OpenAIKey string
}

func (a *App) SaveKey(key string) string {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return fmt.Sprintf("Couldn't get user config directory\n error: %v\n", err)
	}
	fileName := "keys.json"
	fullFilePath := filepath.Join(configDir, "memoDeck", "keys", fileName)

	thisConfig := UserConfig{OpenAIKey: key}

	configJson, err := json.Marshal(thisConfig)
	if err != nil {
		return fmt.Sprintf("Error marshalling config into json.\n error: %v\n", err)
	}

	dirPath := filepath.Join(configDir, "memoDeck", "keys")
	os.MkdirAll(dirPath, 0644)
	os.WriteFile(fullFilePath, configJson, 0644)

	return "success"
}

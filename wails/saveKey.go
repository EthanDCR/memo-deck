package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type UserConfig struct {
	OpenAIKey string
	Provider  string
}

func (a *App) SaveKey(key string, provider string) string {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return fmt.Sprintf("Couldn't get user config directory\n error: %v\n", err)
	}
	fileName := "keys.json"
	fullFilePath := filepath.Join(configDir, "memoDeck", "keys", fileName)

	thisConfig := UserConfig{OpenAIKey: key, Provider: provider}

	configJson, err := json.MarshalIndent(thisConfig, "", "  ")
	if err != nil {
		return fmt.Sprintf("Error marshalling config into json.\n error: %v\n", err)
	}

	dirPath := filepath.Join(configDir, "memoDeck", "keys")
	os.MkdirAll(dirPath, 0755)

	fmt.Printf("Writing to: %s\n", fullFilePath)
	// Check if folder is writable
	info, err := os.Stat(dirPath)
	if err != nil {
		fmt.Println("Folder doesn't even exist!")
	} else {
		fmt.Printf("Folder Permissions: %v\n", info.Mode())
	}

	err = os.WriteFile(fullFilePath, configJson, 0644)
	if err != nil {
		return fmt.Sprintf("error writing key\n error: %v\n", err)
	}

	return "success"
}

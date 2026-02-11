package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func (*App) RevertModel() string {

	configDir, _ := os.UserConfigDir()
	fileName := "keys.json"
	fullFilePath := filepath.Join(configDir, "memoDeck", "keys", fileName)
	err := os.Remove(fullFilePath)
	if err != nil {
		return fmt.Sprintf("Error removing keys file\n error: %v\n", err)
	}
	return "removed"
}

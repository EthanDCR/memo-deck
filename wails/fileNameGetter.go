package main

import (
	"os"
	"path/filepath"
	"strings"
)

func (a *App) GetFileNames() (files []string, err error) {

	configPath, err := os.UserConfigDir()
	if err != nil {
		return []string{}, err
	}

	fullPath := filepath.Join(configPath, "memoDeck")
	entries, err := os.ReadDir(fullPath)
	if err != nil {
		return []string{}, err
	}
	var finalFiles []string
	for _, entry := range entries {
		fileName := entry.Name()
		// Remove .json extension
		if strings.HasSuffix(fileName, ".json") {
			fileName = strings.TrimSuffix(fileName, ".json")
			finalFiles = append(finalFiles, fileName)
		}
	}

	return finalFiles, err
}

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
	var fileList string
	for _, entry := range entries {
		fileList = fileList + string(entry.Name())
	}
	finalFiles := strings.Split(fileList, ".json")

	return finalFiles, err
}

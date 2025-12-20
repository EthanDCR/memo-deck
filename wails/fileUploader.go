package main

import (
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) GetFilePaths() []string {
	selection, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select your workspace files",

		Filters: []runtime.FileFilter{
			{DisplayName: "All Supported Files", Pattern: "*.txt;*.pdf;*.png;*.jpg;*.jpeg"},
		},
	})

	if err != nil {
		return []string{}
	}
	return selection
}

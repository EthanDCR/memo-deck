package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"wails/utils"
)

type Context struct {
	Files []string `json:"files"`
	Notes string   `json:"notes"`
	Count int      `json:"count"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
	Stream   bool      `json:"stream"`
}

func (a *App) SendContext(ctx Context) {
	fmt.Printf("send context called ! ---------------")

	if len(ctx.Files) <= 0 {
		fmt.Printf("files empty\n")
	}

	// count recived number of files
	count := 0
	for _, file := range ctx.Files {
		fmt.Printf(" content %s\n", string(file))
		count++
	}
	fmt.Printf("recived %d file(s):\n", count)

	fileContents := ctx.Notes
	for _, filePath := range ctx.Files {
		data, err := os.ReadFile(filePath)
		if err != nil {
			fmt.Printf("error reading %s: %v\n", filePath, err)
		}
		fileContents += string(data)
	}

	systemPrompt, err := utils.GetSystemPrompt(ctx.Count)
	if err != nil {
		fmt.Println("error getting system prompt")
	}

	chatRequest := ChatRequest{
		Model: "phi",
		Messages: []Message{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: fileContents},
		},
		Stream: false,
	}

	jsonData, err := json.Marshal(chatRequest)
	if err != nil {
		fmt.Printf("couln't convert context struct to json")
	}
	fmt.Printf("sending JSON:\n%s\n", string(jsonData))
	res, err := http.Post("http://localhost:11434/api/chat", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("error posting: %v", err)
	}
	defer res.Body.Close()
	fmt.Printf("Status Code: %d\n", res.StatusCode)

	bodyBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Printf("error reading bytes from response body")
	}
	fmt.Printf("value: %v\n type: %T", res.Body, res.Body)
	bodyString := string(bodyBytes)
	fmt.Printf("response body string: %s", bodyString)

}

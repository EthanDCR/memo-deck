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
	Name  string   `json:"name"`
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

type ChatResponse struct {
	Model          string  `json:"model"`
	Created_at     string  `json:"created_at"`
	Message        Message `json:"message"`
	Total_duration int     `json:"total_duration"`
	Done           bool    `json:"done"`
}

func (a *App) SendContext(ctx Context) {

	if len(ctx.Files) <= 0 {
		fmt.Printf("files empty\n")
	}

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
		fileContents = fileContents + string(data)
	}

	systemPrompt, err := utils.GetSystemPrompt(ctx.Count)
	if err != nil {
		fmt.Println("error getting system prompt")
	}

	chatRequest := ChatRequest{
		Model: "llama3.2:1b",
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
		fmt.Printf("Error posting: %v\n", err)
		return
	}
	defer res.Body.Close()

	fmt.Printf("Status Code: %d\n", res.StatusCode)

	bodyBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Printf("error reading bytes from response body")
	}

	bodyString := string(bodyBytes)
	fmt.Printf("response body string: %s", bodyString)

	var response ChatResponse
	err = json.Unmarshal(bodyBytes, &response)
	if err != nil {
		fmt.Printf("error converting response bytes into json")
	}

	fmt.Printf("Model: %v\n Created_at: %v\n Message: %v\n Total_duration: %v\n Done: %v\n", response.Model, response.Created_at,
		response.Message, response.Total_duration, response.Done)

	message, err := WriteDeck(ctx.Name, response)
	if err != nil {
		fmt.Printf("error writing new deck: \n %v \n %v \n", message, err)
	}
	fmt.Printf(message, nil)
}

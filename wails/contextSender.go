package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"
	"wails/utils"

	"context"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
	"github.com/openai/openai-go/shared"
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
	Format   string    `json:"format"`
}

type ChatResponse struct {
	Model          string  `json:"model"`
	Created_at     string  `json:"created_at"`
	Message        Message `json:"message"`
	Total_duration int     `json:"total_duration"`
	Done           bool    `json:"done"`
}

func detectConfig() (bool, string) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return false, fmt.Sprintf("Error getting user config dir\n error: %v\n", err)
	}
	keyFileName := "keys.json"
	fullFilePath := filepath.Join(configDir, "memoDeck", "keys", keyFileName)
	_, err = os.Stat(fullFilePath)
	if err != nil {
		return false, fmt.Sprintf("couldnt find keys file\n error: %v\n", err)
	}
	return true, "config dir found"
}

func (a *App) SendContext(ctx Context) (message string) {

	status, _ := detectConfig()

	switch status {
	case false:
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
			Format: "json",
		}

		jsonData, err := json.Marshal(chatRequest)
		if err != nil {
			fmt.Printf("couln't convert context struct to json")
		}
		fmt.Printf("sending JSON:\n%s\n", string(jsonData))

		res, err := http.Post("http://localhost:11434/api/chat", "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			fmt.Printf("Error posting: %v\n", err)
			return fmt.Sprintf("Error posting %v\n", err)
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

		message, err = WriteDeck(ctx.Name, response)
		if err != nil {
			fmt.Printf("error writing new deck: \n %v \n %v \n", message, err)
			return "error"
		}
		fmt.Printf(message, nil)
		return "success"

	//openAi API logic
	case true:

		//	Count card count
		//	Files uploaded file text
		//	Name  deckName
		//	Notes extra context
		//fix this! this is only the first file uploaded being sent
		userPrompt := ctx.Files[0] + ctx.Notes

		devMsg, _ := utils.GetSystemPrompt(ctx.Count)

		configDir, _ := os.UserConfigDir()
		keyFileName := "keys.json"
		fullFilePath := filepath.Join(configDir, "memoDeck", "keys", keyFileName)
		fileBytes, err := os.ReadFile(fullFilePath)
		if err != nil {
			return "error reading the key from file"
		}
		var userConf UserConfig
		err = json.Unmarshal(fileBytes, &userConf)

		var client openai.Client
		var modelName shared.ChatModel

		// Configure client and model based on provider
		if userConf.Provider == "openrouter" {
			client = openai.NewClient(
				option.WithAPIKey(userConf.OpenAIKey),
				option.WithBaseURL("https://openrouter.ai/api/v1"),
			)
			modelName = shared.ChatModel("openai/gpt-oss-120b:free")
		} else {
			client = openai.NewClient(
				option.WithAPIKey(userConf.OpenAIKey),
			)
			modelName = shared.ChatModelGPT4o
		}

		params := openai.ChatCompletionNewParams{
			Model: modelName,
			Messages: []openai.ChatCompletionMessageParamUnion{
				// dev instructions for the model
				{
					OfDeveloper: &openai.ChatCompletionDeveloperMessageParam{
						Content: openai.ChatCompletionDeveloperMessageParamContentUnion{
							OfString: openai.String(devMsg),
						},
					},
				},
				// user
				{
					OfUser: &openai.ChatCompletionUserMessageParam{
						Content: openai.ChatCompletionUserMessageParamContentUnion{
							OfString: openai.String(userPrompt),
						},
					},
				},
			},
		}

		// the call
		chatCompletion, err := client.Chat.Completions.New(context.TODO(), params)

		if err != nil {
			fmt.Printf("Error calling OpenAI API: %v\n", err)
			return "error"
		}

		// Extract message from OpenAI response
		var responseMessage Message
		if len(chatCompletion.Choices) > 0 {
			responseMessage = Message{
				Role:    string(chatCompletion.Choices[0].Message.Role),
				Content: chatCompletion.Choices[0].Message.Content,
			}
		}

		chatRes := ChatResponse{
			Model:          string(chatCompletion.Model),
			Created_at:     time.Now().Format(time.RFC3339),
			Message:        responseMessage,
			Total_duration: 0,
			Done:           true,
		}

		// Write the deck
		message, err := WriteDeck(ctx.Name, chatRes)
		if err != nil {
			fmt.Printf("error writing new deck: %v\n", err)
			return "error"
		}
		fmt.Printf("%s\n", message)
		return "success"

	}
	return "error"
}

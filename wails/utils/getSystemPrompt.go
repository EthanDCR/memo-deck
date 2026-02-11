package utils

import (
	"errors"
	"fmt"
)

func GetSystemPrompt(count int) (string, error) {
	if count < 1 || count > 100 {
		return "", errors.New("count must be between 1-100")
	}

	return fmt.Sprintf(`Act as a JSON API server.
Input: Text or Image data.
Output: A JSON array containing exactly %d FlashCards.

Format:
[
  {"question": "string", "answer": "string"}
]

Constraints:
- Output valid JSON only.
- Do not use markdown blocks (no triple backticks).
- Use double quotes for keys and values.
- If the input is insufficient, create cards based on general knowledge of the topic provided.`, count), nil
}

package traversal

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
	"tubes2/backend/internal/model"
)

func SaveTraversalLog(algo string, logs []model.TraversalStep) (string, error) {
	logDir := "logs"

	if err := os.MkdirAll(logDir, os.ModePerm); err != nil {
		return "", err
	}

	timestamp := time.Now().Format("20060102_150405")
	fileName := fmt.Sprintf("traversal_%s_%s.json", algo, timestamp)
	filePath := filepath.Join(logDir, fileName)

	fileData, err := json.MarshalIndent(logs, "", "  ")
	if err != nil {
		return "", err
	}

	if err := os.WriteFile(filePath, fileData, 0644); err != nil {
		return "", err
	}

	return filePath, nil
}

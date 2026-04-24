package api

import (
	"encoding/json"
	"net/http"
	"tubes2/internal/crawler"
	"tubes2/internal/parser"
)

type TraversalRequest struct {
	URL         string `json:"url"`
	Algorithm   string `json:"algorithm"`
	CSSSelector string `json:"css_selector"`
}

func HandleTraverse(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		return
	}

	var req TraversalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	htmlString, _ := crawler.GetHTML(req.URL)
	domTree, _ := parser.ParseHTML(htmlString)

	json.NewEncoder(w).Encode(domTree)
}

package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"tubes2/internal/crawler"
	"tubes2/internal/parser"
	"tubes2/internal/traversal"
)

// Request Payloads
type ParseDOMRequest struct {
	HTML string `json:"html"`
}

type ParseURLRequest struct {
	URL string `json:"url"`
}

type TraversalRequest struct {
	URL         string `json:"url,omitempty"`
	HTML        string `json:"html,omitempty"`
	Algorithm   string `json:"algorithm"`
	CSSSelector string `json:"css_selector"`
	ResultLimit int    `json:"result_limit"`
}

// Helper to prevent frontend CORS blocking
func setupCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
	(*w).Header().Set("Content-Type", "application/json")
}

func HandleParseDOM(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == http.MethodOptions {
		return
	}

	var req ParseDOMRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	domTree, err := parser.ParseHTML(req.HTML)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(domTree)
}

func HandleParseURL(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == http.MethodOptions {
		return
	}

	var req ParseURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	html, err := crawler.GetHTML(req.URL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	domTree, err := parser.ParseHTML(html)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(domTree)
}

func HandleTraverse(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == http.MethodOptions {
		return
	}
	var req TraversalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	rawSelectors := strings.Split(req.CSSSelector, ",")
	var cleanSelectors []string
	for _, s := range rawSelectors {
		cleaned := strings.TrimSpace(s)
		if cleaned != "" {
			cleanSelectors = append(cleanSelectors, cleaned)
		}
	}

	algo := strings.ToUpper(req.Algorithm)
	if algo != "DFS" && algo != "BFS" {
		http.Error(w, "Invalid algorithm. Must be DFS or BFS", http.StatusBadRequest)
		return
	}

	var htmlContent string
	var err error
	if req.HTML != "" {
		htmlContent = req.HTML
	} else if req.URL != "" {
		htmlContent, err = crawler.GetHTML(req.URL)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "Must provide either 'url' or 'html'", http.StatusBadRequest)
		return
	}

	domTree, err := parser.ParseHTML(htmlContent)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resultsMap := traversal.RunMultipleQueries(domTree, cleanSelectors, algo, req.ResultLimit)

	json.NewEncoder(w).Encode(resultsMap)
}

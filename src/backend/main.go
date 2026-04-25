package main

import (
	"log"
	"net/http"
	"tubes2/api"
)

func enableCors(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		w.Header().Set("Access-Control-Allow-Origin", origin)

		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func main() {
	http.HandleFunc("/api/parse-dom", enableCors(api.HandleParseDOM))
	http.HandleFunc("/api/parse-url", enableCors(api.HandleParseURL))
	http.HandleFunc("/api/traverse", enableCors(api.HandleTraverse))

	log.Println("Backend Go running on port 80 with CORS enabled 3")
	err := http.ListenAndServe(":80", nil)
	if err != nil {
		log.Fatal("Server error: ", err)
	}
}

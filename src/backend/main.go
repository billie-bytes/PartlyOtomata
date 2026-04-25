package main

import (
	"log"
	"net/http"
	"tubes2/api"
)

func main() {
	http.HandleFunc("/api/parse-dom", api.HandleParseDOM)
	http.HandleFunc("/api/parse-url", api.HandleParseURL)

	http.HandleFunc("/api/pasrse-url", api.HandleParseURL)

	http.HandleFunc("/api/traverse", api.HandleTraverse)

	log.Println("Server backend Golang beroperasi pada http://localhost:80")
	err := http.ListenAndServe(":80", nil)
	if err != nil {
		log.Fatal("Kegagalan server: ", err)
	}
}

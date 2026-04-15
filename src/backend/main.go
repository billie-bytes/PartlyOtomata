package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// Mendefinisikan struktur data dengan tag JSON
type ResponseData struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
	// Konfigurasi CORS agar frontend dapat mengakses endpoint ini
	w.Header().Set("Access-Control-Allow-Origin", "*") // Gunakan "*" hanya untuk pengembangan
	w.Header().Set("Content-Type", "application/json")

	// Inisialisasi data yang akan dikirim
	data := ResponseData{
		Message: "Koneksi berhasil! Ini adalah data dari server Golang.",
		Status:  200,
	}

	// Serialisasi struktur data Go menjadi format JSON dan mengirimkannya sebagai respons
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	// Mendaftarkan rute /api/data ke fungsi apiHandler
	http.HandleFunc("/api/data", apiHandler)

	log.Println("Server backend Golang beroperasi pada http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Kegagalan server: ", err)
	}
}
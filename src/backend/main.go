package main
 
import (
	"encoding/json"
	"net/http"
	"strconv"
	"tubes2/internal/traversal"
	"tubes2/internal/models"
)

/*
<!doctype html>
<html>
  <head>
    <title>Test Page</title>
  </head>
  <body>
    <div class="container">
      <h1 class="heading" id="main-title">Hello World</h1>

      <div class="box">
        <p class="text">First paragraph</p>
        <p class="text highlight">Second paragraph</p>
        <span>Inline span</span>
      </div>

      <div class="box">
        <p class="text">Third paragraph</p>
        <a class="link" href="/link">Click me</a>
      </div>
    </div>
  </body>
</html>
*/

func dummyTree() *models.DOMTree {
	return &models.DOMTree{
		RootID: 0,
		Nodes: map[int]*models.Node{
			0:  {ID: 0, Tag: "html", Children: []int{1, 2}},
			1:  {ID: 1, Tag: "head", Children: []int{3}},
			2:  {ID: 2, Tag: "body", Children: []int{4}},
			3:  {ID: 3, Tag: "title", Text: "Test Page", Children: []int{}},
			4:  {ID: 4, Tag: "div", Classes: []string{"container"}, Children: []int{5, 6, 10}},
			5:  {ID: 5, Tag: "h1", Classes: []string{"heading"}, Attributes: map[string]string{"id": "main-title"}, Text: "Hello World", Children: []int{}},
			6:  {ID: 6, Tag: "div", Classes: []string{"box"}, Children: []int{7, 8, 9}},
			7:  {ID: 7, Tag: "p", Classes: []string{"text"}, Text: "First paragraph", Children: []int{}},
			8:  {ID: 8, Tag: "p", Classes: []string{"text", "highlight"}, Text: "Second paragraph", Children: []int{}},
			9:  {ID: 9, Tag: "span", Text: "Inline span", Children: []int{}},
			10: {ID: 10, Tag: "div", Classes: []string{"box"}, Children: []int{11, 12}},
			11: {ID: 11, Tag: "p", Classes: []string{"text"}, Text: "Third paragraph", Children: []int{}},
			12: {ID: 12, Tag: "a", Classes: []string{"link"}, Attributes: map[string]string{"href": "/link"}, Text: "Click me", Children: []int{}},
		},
	}
}

func main() {
	
	http.HandleFunc("/bfs", func(w http.ResponseWriter, r *http.Request) {
		selector := r.URL.Query().Get("selector")
		if selector == "" {
			selector = "div.box"
		}

		limit := 0
		if value := r.URL.Query().Get("limit"); value != "" {
			if parsed, err := strconv.Atoi(value); err == nil {
				limit = parsed
			}
		}

		result := core.RunBFS(dummyTree(), selector, limit)
		
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(result)
	})

	http.ListenAndServe(":3000", nil)
}
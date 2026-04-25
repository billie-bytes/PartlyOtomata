# PartlyOtomata
**Tugas Besar IF2211 Strategi Algoritma**

**Disusun oleh:**
1. Billie Bhaskara Wibawa (13524024)
2. Raysha Erviandika Putra (13524050)
3. Dzaki Ahmad Al Hussainy (13524084)

---

## Deskripsi Proyek
PartlyOtomata merupakan perangkat lunak berbasis web yang dirancang untuk melakukan *parsing* dokumen HTML menjadi struktur hierarkis *Document Object Model* (DOM) *Tree*, serta mengeksekusi dan memvisualisasikan algoritma penelusuran (*traversal*) pada struktur pohon tersebut. Sistem ini secara spesifik membandingkan karakteristik penelusuran menggunakan metode komputasi *Breadth-First Search* (BFS) dan *Depth-First Search* (DFS).

## Arsitektur dan Teknologi Sistem
Sistem ini diimplementasikan menggunakan pemisahan fokus (*separation of concerns*) yang terbagi ke dalam dua lapisan utama:
* **Antarmuka Pengguna (*Front-end*):** Dibangun menggunakan **TypeScript** dan *framework* **React**. Lapisan presentasi ini beroperasi pada sisi klien yang berfungsi untuk menerima masukan pengguna dan merender representasi visual secara dinamis, menunjukkan hierarki DOM *Tree*, serta memvisualisasikan hasil penelusuran algoritma secara langkah demi langkah.
* **Sisi Server (*Back-end*):** Dikembangkan menggunakan bahasa pemrograman **Go** (Golang). Lapisan komputasi utama ini bertanggung jawab atas proses pembacaan (*parsing*) string HTML mentah menjadi struktur objek pohon, serta pelaksanaan kalkulasi matematis dan logika algoritma traversal (BFS dan DFS) sebelum metrik hasilnya dikembalikan ke sisi klien.

## Fitur Utama
1. **Konversi HTML ke DOM:** Pemrosesan dokumen teks HTML menjadi struktur data *Node Tree* yang valid.
2. **Visualisasi Hierarki:** Representasi grafis antar simpul (*node*) yang menunjukkan hubungan induk (*parent*), anak (*child*), dan saudara (*sibling*).
3. **Traversal BFS:** Mengeksekusi penelusuran simpul secara horizontal berbasis tingkat kedalaman antrean (*queue-based level-order traversal*).
4. **Traversal DFS:** Mengeksekusi penelusuran simpul secara vertikal berbasis kedalaman tumpukan cabang (*stack-based depth traversal*).
5. **Kalkulasi Metrik:** Menampilkan data komputasional terkait jumlah simpul yang dievaluasi dan urutan penelusuran.
6. **Melakukan Scraping Web:** Aplikasi dapat melakukan scraping terhadap web pada input dan menampilkannya.
7. **Render HTML:** Menampilkan halaman HTML yang dipilih

## Prasyarat Sistem (*Prerequisites*)
Pastikan lingkungan komputasi Anda telah memenuhi persyaratan perangkat lunak berikut sebelum menginisialisasi sistem:
* **Docker** dan **Docker Compose** telah terinstal dan berjalan dengan baik pada mesin lokal Anda.
* Peramban Web (*Web Browser*) dengan dukungan HTML5 dan JavaScript modern.

## Instruksi Instalasi dan Eksekusi
Sistem PartlyOtomata telah dikontainerisasi menggunakan Docker, sehingga proses instalasi dan eksekusi seluruh lapisan (*Front-end* dan *Back-end*) dapat dilakukan secara terpadu dan efisien. Berikut adalah prosedur untuk menjalankan program:

1. **Kloning Repositori:**
   ```bash
   git clone https://github.com/billie-bytes/PartlyOtomata

2. **Menjalankan Kontainer Docker:**
    ``` cd src && docker-compose up
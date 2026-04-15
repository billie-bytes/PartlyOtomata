import { ExplanationLayout } from '../../components/ExplanationLayout';

export function DfsTraversalPage() {
  return (
    <ExplanationLayout title="DOM Tree Traversal">
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 w-full h-full flex flex-col overflow-y-auto">
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">Traversing DOM Trees</h1>
            <p className="text-indigo-700 mb-6 text-lg">Dua strategi utama untuk menjelajahi struktur pohon DOM</p>

            {/* DFS Explanation */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-indigo-800 mb-4">Depth-First Search (DFS)</h2>
              <p className="text-gray-700 mb-4">
                DFS adalah strategi yang menjelajahi DOM tree dengan mengikuti satu cabang sampai ke daun (leaf node) sebelum backtrack ke cabang lain. Pendekatan ini menggunakan <strong>Stack</strong> sebagai struktur data underlying, baik secara eksplisit maupun melalui rekursi.
              </p>
              <div className="bg-indigo-50 p-4 rounded mb-4">
                <p className="font-semibold text-indigo-900 mb-2">Karakteristik DFS pada DOM:</p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>> Menjelajahi cabang pertama secara menyeluruh sebelum ke cabang lain</li>
                  <li>> Menggunakan memory stack untuk tracking parent nodes</li>
                  <li>> Cocok untuk operasi yang memerlukan full tree traversal</li>
                  <li>> Menghasilkan pre-order, in-order, atau post-order traversal</li>
                </ul>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
                <pre>{`function traverseDFS(node) {
  // Process current node
  console.log(node.tagName);
  
  // Recursively process children
  for (let child of node.children) {
    traverseDFS(child);
  }
`}</pre>
              </div>
            </div>

            {/* BFS Explanation */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-indigo-800 mb-4">Penjelasan Breadth-First Search (BFS)</h2>
              <p className="text-gray-700 mb-4">
                BFS menjelajahi DOM tree level demi level, memproses semua nodes pada kedalaman saat ini sebelum bergerak ke kedalaman berikutnya. Strategi ini menggunakan <strong>Queue</strong> untuk mengelola nodes yang akan dikunjungi.
              </p>
              <div className="bg-indigo-50 p-4 rounded mb-4">
                <p className="font-semibold text-indigo-900 mb-2">Karakteristik BFS pada DOM:</p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>> Mengunjungi semua nodes pada level N sebelum level N+1</li>
                  <li>> Lebih hemat memory dibanding DFS untuk tree yang dalam</li>
                  <li>> Ideal untuk menemukan path terpendek dalam DOM</li>
                  <li>> Sering digunakan dalam event bubbling/delegation</li>
                </ul>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
                <pre>{`function traverseBFS(root) {
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    
    // Process current node
    console.log(node.tagName);
    
    // Add children to queue
    queue.push(...node.children);
  }
`}</pre>
              </div>
            </div>

            {/* Comparison */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-2xl font-bold text-indigo-800 mb-4"> Perbandingan DFS vs BFS</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-gray-700 text-sm">
                  <thead>
                    <tr className="bg-indigo-100 border-b-2 border-indigo-300">
                      <th className="p-3 text-left font-bold">Aspek</th>
                      <th className="p-3 text-left font-bold">DFS</th>
                      <th className="p-3 text-left font-bold">BFS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-semibold">Data Structure</td>
                      <td className="p-3">Stack (or Recursion)</td>
                      <td className="p-3">Queue</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-semibold">Memory Usage</td>
                      <td className="p-3">Lebih efisien untuk tree pendek</td>
                      <td className="p-3">Lebih efisien untuk tree dalam</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-semibold">Order Traversal</td>
                      <td className="p-3">Pre/In/Post-order</td>
                      <td className="p-3">Level-order</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-semibold">Use Case DOM</td>
                      <td className="p-3">Query selectors, event handling</td>
                      <td className="p-3">Layer-by-layer processing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

        
        </div>
        </div>
      </div>
    </ExplanationLayout>
  );
}


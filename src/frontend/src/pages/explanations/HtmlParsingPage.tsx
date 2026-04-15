import { ExplanationLayout } from '../../components/ExplanationLayout';

export function HtmlParsingPage() {
  return (
    <ExplanationLayout title="HTML Parsing & DOM Tree">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-full h-full flex flex-col overflow-y-auto">
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <h1 className="text-3xl font-bold text-blue-900 mb-2">HTML Parsing & DOM Tree</h1>
          <p className="text-blue-700 mb-6 text-lg">Memahami cara mengubah HTML text menjadi struktur tree</p>

          {/* Penjelasan HTML */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Penjelasan HTML</h2>
            <p className="text-gray-700 mb-3">
              HTML adalah markup language yang menggunakan <strong>tags</strong> untuk mendeskripsikan struktur dokumen. 
              Setiap tag membuka dan menutup elemen.
            </p>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm mb-3 overflow-x-auto">
              &lt;div&gt;<br/>
              &nbsp;&nbsp;&lt;p&gt;Hello World&lt;/p&gt;<br/>
              &nbsp;&nbsp;&lt;span&gt;Nested text&lt;/span&gt;<br/>
              &lt;/div&gt;
            </div>
            <p className="text-gray-600">
              Struktur nested ini membentuk <strong>relationship</strong> parent-child antar elemen.
            </p>
          </div>

          {/* DOM Tree */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-2xl font-bold text-green-800 mb-4">DOM Tree</h2>
            <p className="text-gray-700 mb-4">
              Browser mengkonversi HTML menjadi tree structure. Setiap elemen adalah node.
            </p>
            
            <div className="bg-green-50 p-5 rounded border-l-4 border-green-500 mb-4">
              <p className="font-semibold text-green-900 mb-4">Contoh Parsing:</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">HTML Input:</p>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                    &lt;html&gt;<br/>
                    &nbsp;&lt;body&gt;<br/>
                    &nbsp;&nbsp;&lt;h1&gt;Title&lt;/h1&gt;<br/>
                    &nbsp;&nbsp;&lt;p&gt;Text&lt;/p&gt;<br/>
                    &nbsp;&lt;/body&gt;<br/>
                    &lt;/html&gt;
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">Tree Result:</p>
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <div>html</div>
                    <div className="ml-4">  body</div>
                    <div className="ml-8">  h1 -> "Title"</div>
                    <div className="ml-8">  p  -> "Text"</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600">
              <strong>Node types:</strong> ElementNode (tags), TextNode (text content), CommentNode, DocumentNode
            </p>
          </div>

          {/* Parsing Algorithm */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Algoritma Parsing</h2>
            
            <div className="space-y-3">
              <div className="bg-purple-50 p-4 rounded">
                <p className="font-semibold text-purple-900 mb-2">Step 1: Tokenization</p>
                <p className="text-gray-700">
                  Baca HTML character by character, split menjadi tokens (opening tags, closing tags, text).
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded">
                <p className="font-semibold text-purple-900 mb-2">Step 2: Tree Construction</p>
                <p className="text-gray-700">
                  Gunakan stack untuk track parent elements. Ketika opening tag, push ke stack. Ketika closing tag, pop dari stack.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded">
                <p className="font-semibold text-purple-900 mb-2">Step 3: Flattened Array</p>
                <p className="text-gray-700">
                  PartlyOtomata menggunakan flattened array untuk efisiensi. Setiap node memiliki unique ID dan reference ke parent/children.
                </p>
              </div>
            </div>
          </div>

          
        </div>
        </div>
      </div>
    </ExplanationLayout>
  );
}

import { ExplanationLayout } from "../../components/ExplanationLayout";

export function LcaAlgorithmPage() {
  return (
    <ExplanationLayout title="Lowest Common Ancestor (LCA)">
      <div className="bg-gradient-to-br from-rose-50 to-rose-100 w-full h-full flex flex-col overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <h1
              className="text-4xl font-bold mb-3"
              style={{ color: "#355872" }}
            >
              Lowest Common Ancestor (LCA)
            </h1>
            <p className="text-lg mb-8 text-gray-600">
              Temukan ancestor yang sama paling dekat dari dua nodes dalam
              sebuah tree.
            </p>

            {/* Definisi */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#355872" }}
              >
                Penjelasan Mengenai LCA
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Lowest Common Ancestor (LCA)</strong> adalah node yang
                merupakan ancestor dari dua nodes tertentu dan terletak paling
                jauh dari root (lowest). Dengan kata lain, LCA adalah ancestor
                yang paling dekat dengan kedua nodes tersebut.
              </p>
            </div>

            {/* Contoh */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#355872" }}
              >
                Tree Structure
              </h2>
              <p className="text-gray-700 mb-4">Perhatikan tree berikut:</p>
              <div className="bg-gray-50 p-6 rounded font-mono text-sm mb-4 overflow-x-auto">
                <pre className="text-gray-700">{`
                        A (root)
                       / \\
                      B   C
                     / \\ / \\
                    D  E F  G
                `}</pre>
              </div>
              <div
                className="bg-amber-50 p-4 rounded border-l-4"
                style={{ borderColor: "#7AAACE" }}
              >
                <p className="font-semibold mb-3" style={{ color: "#355872" }}>
                  Contoh Perhitungan LCA:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li className="pb-2 border-b border-gray-300">
                    <strong>LCA(D, E) = B</strong>
                    <br />
                    <span className="text-sm text-gray-600">
                      D dan E adalah siblings, parent mereka adalah B
                    </span>
                  </li>
                  <li className="pb-2 border-b border-gray-300">
                    <strong>LCA(D, F) = A</strong>
                    <br />
                    <span className="text-sm text-gray-600">
                      Perlu naik ke root A untuk menemukan common ancestor
                    </span>
                  </li>
                  <li className="pb-2 border-b border-gray-300">
                    <strong>LCA(B, D) = B</strong>
                    <br />
                    <span className="text-sm text-gray-600">
                      B sudah ancestor dari D, jadi B adalah LCA-nya
                    </span>
                  </li>
                  <li>
                    <strong>LCA(E, G) = A</strong>
                    <br />
                    <span className="text-sm text-gray-600">
                      E di bawah B, G di bawah C, ancestor tertinggi keduanya
                      adalah A
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExplanationLayout>
  );
}

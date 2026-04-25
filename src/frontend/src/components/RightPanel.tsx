import { useState } from 'react';
import { parseDOMFromHTML, parseDomFromUrl, traverseDOM } from '../store/api';
import { useDOMStore } from '../store/domStore';
import { isValidHtml, isValidUrl } from '../utils/validators';

export function RightPanel() {
  const [urlInput, setUrlInput] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [resultLimitInput, setResultLimitInput] = useState('');
  const [algorithm, setAlgorithm] = useState<'DFS' | 'BFS'>('DFS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const setNodes = useDOMStore(state => state.setNodes);
  const setRawHtml = useDOMStore(state => state.setRawHtml);
  const setQuery = useDOMStore(state => state.setQuery);
  const setMatchedNodeIds = useDOMStore(state => state.setMatchedNodeIds);
  const setVisitedNodeIds = useDOMStore(state => state.setVisitedNodeIds);
  const setTraversalData = useDOMStore(state => state.setTraversalData);
  const setSelectedNodes = useDOMStore(state => state.setSelectedNodes);
  const nodes = useDOMStore(state => state.nodes);
  const rawHtml = useDOMStore(state => state.rawHtml);

  const handleParseURL = async () => {
    if (!urlInput.trim()) {
      setError('URL tidak boleh kosong');
      return;
    }
    if (!isValidUrl(urlInput)) {
      setError('URL tidak valid');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await parseDomFromUrl(urlInput);
      setNodes(response.nodes, response.root_id);
      setRawHtml(typeof response.html === 'string' ? response.html : '');
      setMatchedNodeIds([]);
      setVisitedNodeIds([]);
      setTraversalData(null, 0);
      setSelectedNodes([]);
      setSuccessMessage(`Parse URL berhasil (${response.nodes.length} nodes)`);
      setUrlInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async e => {
      const content = e.target?.result as string;

      if (!isValidHtml(content)) {
        setError('File bukan HTML yang valid');
        return;
      }

      setRawHtml(content);
      setLoading(true);
      setError('');
      setSuccessMessage('');

      try {
        const response = await parseDOMFromHTML(content);
        setNodes(response.nodes, response.root_id);
        setMatchedNodeIds([]);
        setVisitedNodeIds([]);
        setTraversalData(null, 0);
        setSelectedNodes([]);
        setSuccessMessage(`File berhasil diparse (${response.nodes.length} nodes)`);
      } catch (err) {
        setMatchedNodeIds([]);
        setVisitedNodeIds([]);
        setTraversalData(null, 0);
        setSelectedNodes([]);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const handleQuerySubmit = async () => {
    if (!rawHtml.trim()) {
      setError('Masukkan HTML atau URL dulu sebelum memasukkan query');
      return;
    }

    if (!queryInput.trim()) {
      setError('Query tidak boleh kosong');
      return;
    }

    if (nodes.length === 0) {
      setError('DOM belum tersedia untuk traversal');
      return;
    }

    const selector = queryInput.trim();
    const resultLimit = resultLimitInput.trim() === '' ? 0 : Number(resultLimitInput.trim());

    if (!Number.isInteger(resultLimit) || resultLimit < 0) {
      setError('Jumlah hasil tidak valid');
      return;
    }

    setError('');
    setSuccessMessage('');
    setQuery(selector);
    setLoading(true);

    try {
      // resultMap is now a Record/Dictionary mapping selectors to their results
      const resultMap = await traverseDOM("", rawHtml, selector, algorithm, resultLimit);
      
      let allMatchedIds: string[] = [];
      let allVisitedIds: string[] = [];
      let totalTraversalLength = 0;

      // Extract and combine the data from all concurrent queries
      Object.values(resultMap).forEach(result => {
        const safeTraversalOrder = result.traversalOrder || [];
        const safeVisitedOrder = result.visitedOrder || safeTraversalOrder;

        allMatchedIds.push(...safeTraversalOrder.map(String));
        allVisitedIds.push(...safeVisitedOrder.map(String));
        totalTraversalLength += (result.traversalLength || 0);
      });

      // Deduplicate arrays in case multiple queries hit the same node
      const uniqueMatchedIds = Array.from(new Set(allMatchedIds));
      const uniqueVisitedIds = Array.from(new Set(allVisitedIds));
      
      setMatchedNodeIds(uniqueMatchedIds);
      setVisitedNodeIds(uniqueVisitedIds);
      setTraversalData(algorithm, totalTraversalLength);
      setSelectedNodes(uniqueMatchedIds);

      // Check how many sub-queries were actually executed
      const queryCount = Object.keys(resultMap).length;

      if (uniqueMatchedIds.length === 0) {
        setSuccessMessage(`Query aktif: ${selector} (Tidak ada hasil yang ditemukan)`);
      } else {
        // Updated success message to mention concurrent sub-queries
        setSuccessMessage(`Query aktif: ${selector} (${uniqueMatchedIds.length} match dari ${queryCount} query, ${algorithm})`);
      }
      
    } catch (err) {
      setMatchedNodeIds([]);
      setVisitedNodeIds([]);
      setTraversalData(null, 0);
      setSelectedNodes([]);
      setError(err instanceof Error ? err.message : 'Traversal gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold mb-3 text-sm" style={{ color: '#355872' }}>
          Masukkan URL
        </h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleParseURL()}
            placeholder="URL"
            disabled={loading}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400 disabled:bg-gray-100"
            style={{ borderColor: '#7AAACE', color: '#355872' }}
          />
          <button
            onClick={handleParseURL}
            disabled={loading}
            className="flex-shrink-0 px-4 py-2 text-white rounded text-sm font-semibold disabled:bg-gray-400 transition-colors"
            style={{ backgroundColor: '#355872' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a4659')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#355872')}
          >
            {loading ? '...' : 'OK'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold mb-3 text-sm" style={{ color: '#355872' }}>
          Masukkan HTML File
        </h3>
        <label className="block">
          <input
            type="file"
            accept=".html,.htm"
            onChange={handleFileUpload}
            disabled={loading}
            className="block w-full text-sm text-gray-500"
            style={{ accentColor: '#355872' }}
          />
        </label>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold mb-3 text-sm" style={{ color: '#355872' }}>
          Masukkan Query
        </h3>
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setAlgorithm('DFS')}
            className={`flex-1 px-3 py-1 rounded text-xs font-semibold border transition-colors ${
              algorithm === 'DFS'
                ? 'bg-[#355872] text-white border-[#355872]'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            DFS
          </button>
          <button
            type="button"
            onClick={() => setAlgorithm('BFS')}
            className={`flex-1 px-3 py-1 rounded text-xs font-semibold border transition-colors ${
              algorithm === 'BFS'
                ? 'bg-[#355872] text-white border-[#355872]'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            BFS
          </button>
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={queryInput}
            onChange={e => setQueryInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleQuerySubmit()}
            placeholder="div > p, a, .card"
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400"
            style={{ borderColor: '#7AAACE', color: '#355872' }}
          />
          <button
            type="button"
            onClick={handleQuerySubmit}
            className="flex-shrink-0 px-4 py-2 text-white rounded text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#355872' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a4659')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#355872')}
          >
            GO
          </button>
        </div>
        <div className="mt-2">
          <input
            type="number"
            min="0"
            step="1"
            value={resultLimitInput}
            onChange={e => setResultLimitInput(e.target.value)}
            placeholder="Jumlah hasil"
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400"
            style={{ borderColor: '#7AAACE', color: '#355872' }}
          />
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-3 py-2 rounded text-xs">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-800 px-3 py-2 rounded text-xs">
          {error}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { parseDOMFromHTML, parseDomFromUrl, traverseDOM } from '../store/api';
import { useDOMStore } from '../store/domStore';
import { isValidHtml, isValidUrl } from '../utils/validators';

export function RightPanel() {
  const [urlInput, setUrlInput] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const setNodes = useDOMStore(state => state.setNodes);
  const setRawHtml = useDOMStore(state => state.setRawHtml);
  const setQuery = useDOMStore(state => state.setQuery);
  const setMatchedNodeIds = useDOMStore(state => state.setMatchedNodeIds);
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
        setSelectedNodes([]);
        setSuccessMessage(`File berhasil diparse (${response.nodes.length} nodes)`);
      } catch (err) {
        setMatchedNodeIds([]);
        setSelectedNodes([]);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
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
    setError('');
    setSuccessMessage('');
    setQuery(selector);
    setLoading(true);

    try {
      const result = await traverseDOM(selector, 'DFS');
      setMatchedNodeIds(result.traversalOrder);
      setSelectedNodes(result.traversalOrder);
      setSuccessMessage(`Query aktif: ${selector} (${result.traversalOrder.length} match)`);
    } catch (err) {
      setMatchedNodeIds([]);
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
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={queryInput}
            onChange={e => setQueryInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleQuerySubmit()}
            placeholder="div > p"
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

      {nodes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="font-semibold mb-2 text-sm" style={{ color: '#355872' }}>
            DOM Info:
          </p>
          <p className="text-xs text-gray-700">
            Total Nodes: <span className="font-bold">{nodes.length}</span>
          </p>
        </div>
      )}
    </div>
  );
}

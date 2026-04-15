import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/homepage';
import { HtmlParsingPage, DfsTraversalPage, LcaAlgorithmPage } from './pages/explanations';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen" style={{backgroundColor: '#F7F8F0'}}>
        {/* Header */}
        <header className="text-white p-4 text-center shadow-lg" style={{backgroundColor: '#355872'}}>
          <h1 className="text-2xl font-bold">PartlyOtomata - DOM Tree Visualization & Analysis</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/homepage" element={<Home />} />
            <Route path="/explanation/html-parsing" element={<HtmlParsingPage />} />
            <Route path="/explanation/dfs" element={<DfsTraversalPage />} />
            <Route path="/explanation/lca" element={<LcaAlgorithmPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
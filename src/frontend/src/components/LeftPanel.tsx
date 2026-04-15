import { useNavigate, useLocation } from 'react-router-dom';

export function LeftPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { label: 'HTML Parsing', path: '/explanation/html-parsing' },
    { label: 'DFS/BFS Traversal', path: '/explanation/dfs' },
    { label: 'LCA Algorithms', path: '/explanation/lca' },
  ];

  // Show back button only when not on homepage
  const showBackButton = location.pathname !== '/' && location.pathname !== '/homepage';
  
  // Check if currently on explanation page
  const isOnExplanation = location.pathname.startsWith('/explanation/');
  
  // Get button colors based on current page
  const getButtonColor = () => {
    return isOnExplanation ? '#7AAACE' : '#355872';
  };
  
  const getButtonHoverColor = () => {
    return isOnExplanation ? '#5fa8d3' : '#2a4659';
  };

  return (
    <div className="flex flex-col gap-3">
      {showBackButton && (
        <button
          onClick={() => navigate('/')}
          className="text-white font-bold py-3 px-4 rounded text-center transition-colors text-sm"
          style={{backgroundColor: '#2a4659'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f3847'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a4659'}
        >
          ← Back Home
        </button>
      )}
      {buttons.map(btn => (
        <button
          key={btn.path}
          onClick={() => navigate(btn.path)}
          className="text-white font-bold py-3 px-4 rounded text-center transition-colors"
          style={{backgroundColor: getButtonColor()}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getButtonHoverColor()}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = getButtonColor()}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
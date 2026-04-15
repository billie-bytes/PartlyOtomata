// src/frontend.tsx
import { createRoot } from 'react-dom/client';
import App from './App';
// import './index.css'; // Opsional: jika ingin melampirkan CSS lewat JS

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Elemen dengan id 'root' tidak ditemukan!");
}
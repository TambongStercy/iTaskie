import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import './styles.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        {/* The router is now handled in main.tsx */}
      </div>
    </AuthProvider>
  );
}

export default App;

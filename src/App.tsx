import React from 'react';
import { Outlet } from 'react-router-dom';
import './styles.css';
import { EmailJSInitializer } from './utils/emailjs-config';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EmailJSInitializer />
      <Outlet />
    </div>
  );
}

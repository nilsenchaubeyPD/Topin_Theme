import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// ?theme=orange|indigo|forest picks the starting theme; ?embed=1 hides the theme switcher (used by the feedback page).
const params = new URLSearchParams(window.location.search);
const THEMES = { orange: 'Orange + Graphite', indigo: 'Indigo', forest: 'Forest' };
const theme = THEMES[(params.get('theme') || '').toLowerCase()] || 'Orange + Graphite';
if (params.get('embed') === '1') document.documentElement.setAttribute('data-embed', '');

createRoot(document.getElementById('root')).render(<App theme={theme} />);

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
// GitHub Pages 沒有各頁面的伺服器重寫功能；# 後面的頁面由瀏覽器處理。
const Router = import.meta.env.MODE === 'pages' ? HashRouter : BrowserRouter;
createRoot(document.getElementById('root')).render(<React.StrictMode><Router><App /></Router></React.StrictMode>);

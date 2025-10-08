import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css';
import reportWebVitals from './reportWebVitals';

// 🆕 import ToastContainer and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* 🆕 Add toast container globally here */}
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
  </React.StrictMode>
);

reportWebVitals();

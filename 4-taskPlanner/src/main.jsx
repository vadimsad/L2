import React from 'react'
import ReactDOM from 'react-dom/client'

import './assets/styles/index.css';
import App from './components/App/App';
import Layout from './components/Layout/Layout';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>,
)

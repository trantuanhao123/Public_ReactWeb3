// main.jsx
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
const basename = import.meta.env.MODE === 'production' ? '/Public_ReactWeb3' : '';
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/Public_ReactWeb3'>
    <App />
  </BrowserRouter>
);
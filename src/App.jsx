import { Routes, Route } from 'react-router-dom';
import routes from './router_page.jsx';

function App() {
  console.log('App component rendered');
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={route.element}
        />
      ))}
    </Routes>
  );
}

export default App;
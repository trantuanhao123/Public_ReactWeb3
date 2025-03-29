import { Route, Routes , useLocation} from 'react-router-dom';
import routes from './router_page';
import Header from "./component_page/layout/header";

function App() {
  const location = useLocation();
  const route = routes.flatMap(routeGroup => routeGroup.data)
                      .find(route => route.path === location.pathname);
  const showHeader = route ? route.showHeader : true;  
  return (
    <>
    {showHeader && <Header />}
        <Routes>
          {routes.map((routeGroup, index) => (
            routeGroup.data.map((route, routeIndex) => (
              <Route
                key={routeIndex}
                path={route.path}
                element={route.element}
              />
            ))
          ))}
        </Routes>
    </>
  );
}

export default App;


import { Link } from 'react-router';
import routes from '../../routes';

interface RouteConfig {
  file?: string;
  path?: string;
  children?: RouteConfig[];
}

// visual以下のルートのみを取得する関数
function getVisualRoutes(routeConfig: RouteConfig[]) {
  const visualRoute = routeConfig.find(route => route.path === 'visual');

  if (!visualRoute?.path || !visualRoute.children) {
    return [];
  }

  return visualRoute.children
    .filter((route): route is RouteConfig & { path: string } => !!route.path)
    .map(route => ({
      path: `visual/${route.path}`.replace(/\/+/g, '/'),
      label: route.path.charAt(0).toUpperCase() + route.path.slice(1).replace(/([A-Z])/g, ' $1').trim()
    }));
}

export function Navigation() {
  const navItems = getVisualRoutes(routes).reverse();

  return (
    <div className="">
      <nav>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
          {navItems.map((item, index) => (
            <li className="" key={index}>
              <Link to={item.path} className="hover:opacity-80">
                <div className="w-full h-8 bg-gray-400"></div>
                <h2 className="leading-tight pt-1">{item.label}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
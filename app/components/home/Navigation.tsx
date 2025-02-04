import { Link } from 'react-router';
import routes from '../../routes';

interface RouteConfig {
  file?: string;
  path?: string;
  children?: RouteConfig[];
}

const navigationItems = [
  {
    path: '/visual/gamingTopdownView',
    label: 'Gaming Top-down View (WIP)',
    thumbnail: '/images/thumbnails/gamingTopdownView.png'
  },
  {
    path: '/visual/sampleVrm',
    label: 'Sample Load VRM',
    thumbnail: '/images/thumbnails/sampleVrm.png'
  },
  {
    path: '/visual/effectTest',
    label: 'Effect Test',
    thumbnail: '/images/thumbnails/effectTest.png'
  },
  {
    path: '/visual/manyCircle',
    label: 'Audio Reactive (Circle)',
    thumbnail: '/images/thumbnails/manyCircle.png'
  },
  {
    path: '/visual/studyGlsl',
    label: 'study GLSL',
    thumbnail: '/images/thumbnails/studyGlsl.png'
  },
 
  {
    path: '/visual/imageSlide',
    label: 'Custom Slide Image',
    thumbnail: '/images/thumbnails/imageSlide.png'
  },
  {
    path: '/visual/ballAttract',
    label: 'Ball Attract',
    thumbnail: '/images/thumbnails/ballAttract.png'
  },
  {
    path: '/visual/sampleCustomShader',
    label: 'Sample CustomShader',
    thumbnail: '/images/thumbnails/sampleCustomShader.png'
  },
  {
    path: '/visual/sampleBufferGeometry',
    label: 'Sample Buffer Geometry',
    thumbnail: '/images/thumbnails/sampleBufferGeometry.png'
  },
  {
    path: '/visual/sampleAudio',
    label: 'Sample Audio Input',
    thumbnail: '/images/thumbnails/sampleAudio.png'
  },


]


// visual以下のルートのみを取得する関数

// function getVisualRoutes(routeConfig: RouteConfig[]) {
//   const visualRoute = routeConfig.find(route => route.path === 'visual');

//   if (!visualRoute?.path || !visualRoute.children) {
//     return [];
//   }

//   return visualRoute.children
//     .filter((route): route is RouteConfig & { path: string } => !!route.path)
//     .map(route => ({
//       path: `visual/${route.path}`.replace(/\/+/g, '/'),
//       label: route.path.charAt(0).toUpperCase() + route.path.slice(1).replace(/([A-Z])/g, ' $1').trim()
//     }));
// }

export function Navigation() {
  // const navItems = getVisualRoutes(routes).reverse();

  return (
    <div className="">
      <nav>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
          {navigationItems.map((item, index) => (
            <li className="" key={index}>
              <Link to={item.path} className="hover:opacity-80">
                <div className="w-full h-16 bg-gray-400 overflow-hidden">
                  <img src={item.thumbnail} alt={item.label} className="w-full h-full object-cover" />
                </div>
                <h2 className="leading-tight pt-1">{item.label}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
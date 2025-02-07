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
    label: 'Gaming Top-down View',
    thumbnail: '/images/thumbnails/gamingTopdownView.png',
    tags: ['WIP', 'Game']
  },
  {
    path: '/visual/sampleVrm',
    label: 'Sample Load VRM',
    thumbnail: '/images/thumbnails/sampleVrm.png',
    tags: ['Three.js', 'VRM']
  },

  {
    path: '/visual/effectTest',
    label: 'Effect Test',
    thumbnail: '/images/thumbnails/effectTest.png',
    tags: ['Three.js', 'GLSL']
  },
  {
    path: '/visual/manyCircle',
    label: 'Audio Reactive (Circle)',
    thumbnail: '/images/thumbnails/manyCircle.png',
    tags: ['Three.js', 'Audio']
  },

  {
    path: '/visual/studyGlsl',
    label: 'study GLSL',
    thumbnail: '/images/thumbnails/studyGlsl.png',
    tags: ['Three.js', 'GLSL']
  },
 


  {
    path: '/visual/imageSlide',
    label: 'Custom Slide Image',
    thumbnail: '/images/thumbnails/imageSlide.png',
    tags: ['Three.js', 'GLSL']

  },
  {
    path: '/visual/ballAttract',
    label: 'Ball Attract',
    thumbnail: '/images/thumbnails/ballAttract.png',
    tags: ['Three.js', 'Rapier']
  },
  {
    path: '/visual/sampleCustomShader',
    label: 'Sample CustomShader',
    thumbnail: '/images/thumbnails/sampleCustomShader.png',
    tags: ['Three.js', 'GLSL']
  },
  {
    path: '/visual/sampleBufferGeometry',
    label: 'Sample Buffer Geometry',
    thumbnail: '/images/thumbnails/sampleBufferGeometry.png',
    tags: ['Three.js']
  },

  {
    path: '/visual/sampleAudio',
    label: 'Sample Audio Input',
    thumbnail: '/images/thumbnails/sampleAudio.png',
    tags: ['Three.js', 'Audio']
  },
  {
    path: '/visual/preRenderMovie',
    label: 'Prerender Movie',
    thumbnail: '/images/thumbnails/preRenderMovie.png',
    tags: ['Houdini']
  },
  {
    path: '/visual/preRenderImage',
    label: 'Prerender Image',
    thumbnail: '/images/thumbnails/preRenderImage.png',
    tags: ['Houdini']
  }
]




export function Navigation() {
  // const navItems = getVisualRoutes(routes).reverse();

  return (
    <div className="">
      <nav>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 md:gap-8">
          {navigationItems.map((item, index) => (
            <li className="" key={index}>
              <Link to={item.path} className="hover:opacity-80">
                <div className="w-full h-24 bg-gray-400 overflow-hidden relative">
                  <img src={item.thumbnail} alt={item.label} className="w-full h-full object-cover" />
                  <ul className="absolute bottom-2 left-2 flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <li key={index} className="text-xs text-black bg-white/80 px-1">{tag}</li>
                    ))}
                  </ul>
                </div>
                <h2 className="leading-tight pt-2 text-sm">{item.label}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}